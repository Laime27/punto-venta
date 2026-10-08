<?php

namespace App\Services;

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
use App\Models\TipoComprobante;
use Exception;
use App\Exceptions\BusinessException;

class ComprobanteService
{
    protected $clienteService;
    protected $tipoComprobanteService;

    public function __construct(ClienteService $clienteService, TipoComprobanteService $tipoComprobanteService)
    {
        $this->clienteService = $clienteService;
        $this->tipoComprobanteService = $tipoComprobanteService;
    }

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
                $infoComprobante = $this->tipoComprobanteService->procesarSiguienteCorrelativo();
                $clienteId = $this->obtenerClienteId($data);
                $tipoPago = $data['tipoVenta'] ?? ($data['tipo_pago'] ?? 'contado');

                $comprobante = $this->crearComprobante($data, $infoComprobante, $clienteId, $tipoPago);

                $this->procesarCarrito($comprobante, $data['carrito'] ?? []);

                if (!empty($data['pagos'])) {
                    $this->procesarPagos($comprobante, $data['pagos']);
                }

                if ($tipoPago === 'credito') {
                    $this->procesarCredito($comprobante, $data['pagos'] ?? []);
                }

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

        return Comprobante::create([
            'codigo_venta' => $infoComprobante['codigo_venta'],
            'cliente_id' => $clienteId,
            'tipo_comprobante_id' => $infoComprobante['tipo_comprobante_id'],
            'serie' => $infoComprobante['serie'],
            'correlativo' => $infoComprobante['correlativo'],
            'subtotal' => $data['totales']['subtotal'] ?? 0,
            'impuesto' => 0,
            'descuento' => $data['totales']['descuento'] ?? 0,
            'total' => $data['totales']['total'] ?? 0,
            'estado' => $estadoComprobante,
            'user_id' => Auth::id() ?? 1,
        ]);
    }

    private function procesarCarrito(Comprobante $comprobante, array $carrito): void
    {
        foreach ($carrito as $item) {
            $producto = Producto::find($item['producto_id']);

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
        foreach ($pagos as $pago) {
            ComprobantePago::create([
                'comprobante_id' => $comprobante->id,
                'metodo_pago_id' => $pago['metodo_pago_id'],
                'monto' => $pago['monto'],
                'referencia' => null
            ]);
        }
    }

    private function procesarCredito(Comprobante $comprobante, array $pagos): void
    {
        $montoPagado = collect($pagos)->sum('monto');
        $saldoPendiente = $comprobante->total - $montoPagado;

        ComprobanteCredito::create([
            'comprobante_id' => $comprobante->id,
            'fecha' => now()->toDateString(),
            'monto' => $comprobante->total,
            'saldo_pendiente' => $saldoPendiente,
            'estado' => $saldoPendiente <= 0 ? EstadoComprobanteCreditoEnum::PAGADO->value : EstadoComprobanteCreditoEnum::PENDIENTE->value
        ]);
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
            } elseif ($tipoPago === 'credito') {
                if (round($montoPagado, 2) >= round($total, 2)) {
                    throw new BusinessException("En una venta al crédito, el monto pagado no puede ser igual o mayor al total. Debes usar la opción al contado.");
                }
            }
        } else {
            throw new BusinessException("No se puede registrar una venta si el total es 0.");
        }
    }
}
