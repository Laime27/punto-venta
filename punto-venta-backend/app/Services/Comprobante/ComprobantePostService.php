<?php

namespace App\Services\Comprobante;

use App\Models\Comprobante;
use App\Models\ComprobanteDetalle;
use App\Models\ComprobantePago;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\ComprobanteCredito;
use App\Models\Producto;
use App\Models\HistorialMovimiento;
use App\Enums\TipoMovimientoEnum;
use App\Enums\TipoComprobanteEnum;
use App\Enums\EstadoComprobanteEnum;
use App\Enums\EstadoComprobanteCreditoEnum;
use App\Enums\FormaPagoEnum;
use App\Enums\TipoMetodoPagoEnum;
use App\Models\MetodoPago;
use App\Models\TipoComprobante;
use App\Models\Cliente;
use App\Services\Caja\CajaService;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use App\Exceptions\BusinessException;
use App\Services\ClienteService;
use App\Services\TipoComprobanteService;
use App\Services\CotizacionService;
use App\Models\Cotizacion;

class ComprobantePostService
{
    public function __construct(
        protected ClienteService $clienteService,
        protected TipoComprobanteService $tipoComprobanteService,
        protected CajaService $cajaService,
        protected CotizacionService $cotizacionService
    ) {}

    public function registrarVenta(array $data)
    {
        $this->validarPagosVenta($data);

        $codigoUnico = $data['codigo_unico'] ?? null;
        $lock = null;

        if ($codigoUnico) {
            $lock = Cache::lock('venta_idempotency_' . $codigoUnico, 60);
            
            if (!$lock->get()) {
                throw new BusinessException("Esta venta ya fue procesada o se está procesando. Por favor verifica.");
            }
        } else {
            $userId = Auth::id() ?? 1;
            $lock = Cache::lock('registro_venta_usuario_' . $userId, 5);
            if (!$lock->get()) {
                throw new BusinessException("Se está procesando una venta. Por favor, espere un momento.");
            }
        }

        try {
            return DB::transaction(function () use ($data) {
                $cotizacion = null;
                if (!empty($data['cotizacion_id'])) {
                    $cotizacion = Cotizacion::with('detalles')->lockForUpdate()->findOrFail($data['cotizacion_id']);
                    $this->cotizacionService->validarConvertibleAVenta($cotizacion);
                    $this->validarPreciosCotizados($cotizacion, $data['carrito'] ?? []);
                }

                $productos = $this->bloquearYValidarStock($data['carrito'] ?? []);

                $infoComprobante = $this->tipoComprobanteService->procesarSiguienteCorrelativo();
                $clienteId = $this->obtenerClienteId($data);
                $tipoPago = $data['tipoVenta'] ?? ($data['tipo_pago'] ?? 'contado');

                $comprobante = $this->crearComprobante($data, $infoComprobante, $clienteId, $tipoPago);

                $this->procesarCarrito($comprobante, $data['carrito'] ?? [], $productos);

                if (!empty($data['pagos'])) {
                    $this->procesarPagos($comprobante, $data['pagos']);
                }

                if ($tipoPago === 'credito') {
                    $this->procesarCredito($comprobante, $data['cuotas'] ?? []);
                }

                $cotizacion?->update(['comprobante_id' => $comprobante->id]);

                return $comprobante->load('detalles', 'pagos', 'tipoComprobante');
            });
        } catch (Exception $e) {
            if ($lock) {
                $lock->release();
            }
            throw $e;
        } finally {
            if (!$codigoUnico && $lock) {
                $lock->release();
            }
        }
    }

    private function obtenerClienteId(array $data): int
    {
        $clienteId = $data['cliente_id'] ?? null;
        if (!$clienteId) {
            $clientePorDefecto = $this->clienteService->obtenerOCrearClientePorDefecto();
            $clienteId = $clientePorDefecto->id;
        }
        return (int) $clienteId;
    }

    private function crearComprobante(array $data, array $infoComprobante, int $clienteId, string $tipoPago): Comprobante
    {
        $estadoComprobante = $tipoPago === 'credito' ? EstadoComprobanteEnum::PENDIENTE->value : EstadoComprobanteEnum::PAGADO->value;
        $formaPago = $tipoPago === 'credito' ? FormaPagoEnum::CREDITO->value : FormaPagoEnum::CONTADO->value;

        $cajaAbierta = $this->cajaService->obtenerCajaActiva();

        if (!$cajaAbierta) {
            throw new BusinessException("Debe abrir una caja antes de registrar ventas.");
        }

        return Comprobante::create([
            'codigo_venta' => $infoComprobante['codigo_venta'],
            'cliente_id' => $clienteId,
            'caja_id' => $cajaAbierta->id,
            'tipo_comprobante_id' => $infoComprobante['tipo_comprobante_id'],
            'serie' => $infoComprobante['serie'],
            'correlativo' => $infoComprobante['correlativo'],
            'fecha_emision' => now(),
            'subtotal' => $data['totales']['subtotal'] ?? 0,
            'impuesto' => 0,
            'descuento' => $data['totales']['descuento'] ?? 0,
            'total' => $data['totales']['total'] ?? 0,
            'forma_pago' => $formaPago,
            'estado' => $estadoComprobante,
            'user_id' => Auth::id(),
        ]);
    }

    /**
     * Bloquea las filas de los productos hasta que termine la transacción, así dos ventas
     * simultáneas no pueden descontar el mismo stock. Suma las cantidades por producto
     * por si el mismo producto viene en más de una línea del carrito.
     */
    private function bloquearYValidarStock(array $carrito): Collection
    {
        $cantidades = collect($carrito)
            ->groupBy('producto_id')
            ->map(fn ($items) => round((float) $items->sum('cantidad'), 2));

        $productos = Producto::whereIn('id', $cantidades->keys())
            ->orderBy('id')
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        $faltantes = $cantidades
            ->filter(fn ($cantidad, $id) => $productos->has($id) && $cantidad > (float) $productos[$id]->stock)
            ->map(fn ($cantidad, $id) => "{$productos[$id]->nombre} (disponible: " . (float) $productos[$id]->stock . ", solicitado: {$cantidad})");

        if ($faltantes->isNotEmpty()) {
            throw new BusinessException("Stock insuficiente para: " . $faltantes->implode(', ') . ".");
        }

        return $productos;
    }

    // Los productos de la cotización se venden al precio cotizado; los agregados aparte, a su precio normal
    private function validarPreciosCotizados(Cotizacion $cotizacion, array $carrito): void
    {
        $detalles = $cotizacion->detalles->keyBy('producto_id');

        foreach ($carrito as $item) {
            $detalle = $detalles->get($item['producto_id']);
            if (!$detalle) continue;

            $precioCotizado = $this->cotizacionService->precioCotizado($detalle);

            if (abs((float) $item['precio'] - $precioCotizado) > 0.01) {
                $nombre = Producto::find($item['producto_id'])?->nombre ?? "#{$item['producto_id']}";
                throw new BusinessException("El precio de {$nombre} debe ser el cotizado ({$precioCotizado}).");
            }
        }
    }

    private function procesarCarrito(Comprobante $comprobante, array $carrito, Collection $productos): void
    {
        foreach ($carrito as $item) {
            $producto = $productos->get($item['producto_id']);

            if ($producto) {
                if ($item['cantidad'] == null) {
                    throw new BusinessException("La cantidad del producto " . $producto->nombre . " no puede ser nula.");
                }

                if ($item['cantidad'] > 0) {
                    $stockAnterior = $producto->stock;
                    $stockActual = $stockAnterior - $item['cantidad'];

                    $producto->update(['stock' => $stockActual]);

                    HistorialMovimiento::create([
                        'producto_id' => $producto->id,
                        'user_id' => Auth::id() ?? 1,
                        'tipo_movimiento_id' => TipoMovimientoEnum::VENTA->value,
                        'documento_id' => $comprobante->id,
                        'documento_type' => Comprobante::class,
                        'operacion' => '-',
                        'cantidad' => $item['cantidad'],
                        'stock_anterior' => $stockAnterior,
                        'stock_actual' => $stockActual,
                        'observacion' => 'Venta registrada',
                        'fecha_emision' => now(),
                    ]);
                }
            }

            ComprobanteDetalle::create([
                'comprobante_id' => $comprobante->id,
                'producto_id' => $item['producto_id'],
                'cantidad' => $item['cantidad'],
                'precio_unitario' => $item['precio'],
                'subtotal' => $item['subtotal']
            ]);
        }
    }

    private function procesarPagos(Comprobante $comprobante, array $pagos): void
    {
        $vueltoPendiente = max(0, round(collect($pagos)->sum('monto') - (float) $comprobante->total, 2));
        $idsEfectivo = $this->obtenerIdsMetodosEfectivo($pagos);

        foreach ($pagos as $pago) {
            $montoDevuelto = 0;

            if ($vueltoPendiente > 0 && in_array($pago['metodo_pago_id'], $idsEfectivo)) {
                $montoDevuelto = min($vueltoPendiente, (float) $pago['monto']);
                $vueltoPendiente = round($vueltoPendiente - $montoDevuelto, 2);
            }

            ComprobantePago::create([
                'comprobante_id' => $comprobante->id,
                'caja_id' => $comprobante->caja_id,
                'metodo_pago_id' => $pago['metodo_pago_id'],
                'monto' => $pago['monto'],
                'monto_devuelto' => $montoDevuelto,
                'referencia' => null
            ]);
        }
    }

    private function obtenerIdsMetodosEfectivo(array $pagos): array
    {
        return MetodoPago::whereIn('id', collect($pagos)->pluck('metodo_pago_id'))
            ->where('tipo', TipoMetodoPagoEnum::EFECTIVO->value)
            ->pluck('id')
            ->all();
    }

    private function procesarCredito(Comprobante $comprobante, array $cuotas): void
    {
        foreach (collect($cuotas)->sortBy('fecha') as $cuota) {
            $monto = round((float) $cuota['monto'], 2);

            ComprobanteCredito::create([
                'comprobante_id' => $comprobante->id,
                'fecha' => Carbon::parse($cuota['fecha'])->toDateString(),
                'monto' => $monto,
                'saldo_pendiente' => $monto,
                'estado' => EstadoComprobanteCreditoEnum::PENDIENTE->value,
            ]);
        }
    }

    private function validarCuotas(array $cuotas, float $saldoAFinanciar): void
    {
        if (empty($cuotas)) {
            throw new BusinessException("En una venta al crédito, debe registrar al menos una cuota.");
        }

        if (collect($cuotas)->contains(fn ($cuota) => Carbon::parse($cuota['fecha'])->lt(today()))) {
            throw new BusinessException("La fecha de las cuotas no puede ser anterior a hoy.");
        }

        $totalCuotas = round(collect($cuotas)->sum(fn ($cuota) => (float) $cuota['monto']), 2);

        if (abs($totalCuotas - $saldoAFinanciar) > 0.01) {
            throw new BusinessException("La suma de las cuotas ({$totalCuotas}) debe ser igual al saldo a financiar ({$saldoAFinanciar}).");
        }
    }

    private function validarPagosVenta(array $data): void
    {
        $tipoPago = $data['tipoVenta'] ?? ($data['tipo_pago'] ?? 'contado');
        $total = (float) ($data['totales']['total'] ?? 0);
        $pagos = $data['pagos'] ?? [];
        $montoPagado = collect($pagos)->sum('monto');

        if ($total > 0) {
            if ($tipoPago === 'contado') {
                if (empty($pagos)) {
                    throw new BusinessException("En una venta al contado, debe ingresar al menos un método de pago.");
                }
                if (round($montoPagado, 2) < round($total, 2)) {
                    throw new BusinessException("En una venta al contado, el monto pagado (" . round($montoPagado, 2) . ") debe ser al menos igual al total de la venta (" . round($total, 2) . ").");
                }

                $vuelto = round($montoPagado - $total, 2);
                if ($vuelto > 0) {
                    $idsEfectivo = $this->obtenerIdsMetodosEfectivo($pagos);
                    $montoEfectivo = round(collect($pagos)->whereIn('metodo_pago_id', $idsEfectivo)->sum('monto'), 2);

                    if ($vuelto > $montoEfectivo) {
                        throw new BusinessException("El vuelto ({$vuelto}) no puede ser mayor al monto pagado en efectivo ({$montoEfectivo}). Revise los montos de tarjeta o transferencia.");
                    }
                }
            } elseif ($tipoPago === 'credito') {
                $clienteId = $data['cliente_id'] ?? null;
                if (empty($clienteId)) {
                    throw new BusinessException("Para una venta al crédito, es obligatorio seleccionar un cliente.");
                }

                $cliente = Cliente::find($clienteId);
                if (!$cliente) {
                    throw new BusinessException("El cliente seleccionado para el crédito no existe.");
                }

                if ($cliente->es_sistema) {
                    throw new BusinessException("No se puede otorgar crédito a un cliente genérico. Debe seleccionar un cliente registrado.");
                }

                if (round($montoPagado, 2) >= round($total, 2)) {
                    throw new BusinessException("En una venta al crédito, el monto pagado no puede ser igual o mayor al total. Debes usar la opción al contado.");
                }

                $this->validarCuotas($data['cuotas'] ?? [], round($total - $montoPagado, 2));
            }
        } else {
            throw new BusinessException("No se puede registrar una venta si el total es 0.");
        }
    }
}
