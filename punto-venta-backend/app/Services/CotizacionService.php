<?php

namespace App\Services;

use App\Models\Cotizacion;
use App\Models\CotizacionDetalle;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\BusinessException;
use App\Enums\EstadoCotizacionEnum;
use App\Enums\TipoComprobanteEnum;

class CotizacionService
{
    protected $tipoComprobanteService;

    public function __construct(TipoComprobanteService $tipoComprobanteService)
    {
        $this->tipoComprobanteService = $tipoComprobanteService;
    }

    public function listarCotizaciones()
    {
        Cotizacion::where('estado', EstadoCotizacionEnum::PENDIENTE->value)
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<', now())
            ->update(['estado' => EstadoCotizacionEnum::VENCIDA->value]);

        return Cotizacion::with(['cliente', 'user', 'comprobante:id,serie,correlativo'])->orderBy('id', 'desc')->paginate(10);
    }

    public function crearCotizacion(array $data)
    {
        return DB::transaction(function () use ($data) {
            $descuentoGeneral = $data['descuento'] ?? 0;
            $porcentajeImpuesto = $data['porcentaje_impuesto'] ?? 18.00;
            
            $totales = $this->calcularTotales($data['detalles'], $descuentoGeneral, $porcentajeImpuesto);
            $infoComprobante = $this->tipoComprobanteService->procesarSiguienteCorrelativo(TipoComprobanteEnum::COTIZACION->value);

            $cotizacion = Cotizacion::create([
                'cliente_id' => $data['cliente_id'] ?? null,
                 'serie_id' => $infoComprobante['tipo_comprobante_id'],
                'serie' => $infoComprobante['serie'],
                'correlativo' => $infoComprobante['correlativo'],
                'fecha_emision' => $data['fecha_emision'] ?? now(),
                'fecha_vencimiento' => $data['fecha_vencimiento'] ?? null,
                'estado' => $data['estado'] ?? EstadoCotizacionEnum::PENDIENTE->value,
                'subtotal' => $totales['subtotal'],
                'descuento' => $descuentoGeneral,
                'porcentaje_impuesto' => $porcentajeImpuesto,
                'monto_impuesto' => $totales['monto_impuesto'],
                'total' => $totales['total'],
                'observaciones' => $data['observaciones'] ?? null,
                'user_id' => Auth::id(),
            ]);

            $this->sincronizarDetalles($cotizacion, $data['detalles']);

            return $cotizacion->load('detalles.producto');
        });
    }

    public function actualizarCotizacion(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $cotizacion = Cotizacion::findOrFail($id);

            if ($cotizacion->estado !== EstadoCotizacionEnum::PENDIENTE->value) {
                throw new BusinessException("Solo se pueden editar cotizaciones en estado PENDIENTE.");
            }

            $descuentoGeneral = $data['descuento'] ?? $cotizacion->descuento;
            $porcentajeImpuesto = $data['porcentaje_impuesto'] ?? $cotizacion->porcentaje_impuesto;
            
            $totales = $this->calcularTotales($data['detalles'], $descuentoGeneral, $porcentajeImpuesto);

            $cotizacion->update([
                'cliente_id' => $data['cliente_id'] ?? $cotizacion->cliente_id,
                'fecha_emision' => $data['fecha_emision'] ?? $cotizacion->fecha_emision,
                'fecha_vencimiento' => $data['fecha_vencimiento'] ?? $cotizacion->fecha_vencimiento,
                'estado' => $data['estado'] ?? $cotizacion->estado,
                'subtotal' => $totales['subtotal'],
                'descuento' => $descuentoGeneral,
                'porcentaje_impuesto' => $porcentajeImpuesto,
                'monto_impuesto' => $totales['monto_impuesto'],
                'total' => $totales['total'],
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            $this->sincronizarDetalles($cotizacion, $data['detalles']);

            return $cotizacion->load('detalles.producto');
        });
    }

    public function eliminar(int $id)
    {
        $cotizacion = Cotizacion::findOrFail($id);
        if ($cotizacion->estado !== EstadoCotizacionEnum::PENDIENTE->value) {
            throw new BusinessException("Solo se pueden eliminar cotizaciones en estado PENDIENTE.");
        }
        $cotizacion->delete();
        return true;
    }

    public function mostrar($id)
    {
        return Cotizacion::with(['cliente', 'user', 'detalles.producto', 'comprobante:id,serie,correlativo'])->findOrFail($id);
    }

    public function validarConvertibleAVenta(Cotizacion $cotizacion): void
    {
        if ($cotizacion->estado !== EstadoCotizacionEnum::ACEPTADA->value) {
            throw new BusinessException("Solo se pueden convertir en venta las cotizaciones ACEPTADAS.");
        }

        if ($cotizacion->comprobante_id) {
            $venta = $cotizacion->comprobante;
            throw new BusinessException("La cotización ya fue convertida en la venta {$venta?->serie}-{$venta?->correlativo}.");
        }
    }

    public function prepararParaVenta(int $id): array
    {
        $cotizacion = Cotizacion::with([
            'cliente',
            'detalles.producto:id,nombre,precio_venta,precio_mayoreo,precio_compra,stock,codigo_barras,unidad_id,imagen,disponible_venta',
            'detalles.producto.unidad:id,nombre,permite_decimales',
        ])->findOrFail($id);
      
        $this->validarConvertibleAVenta($cotizacion);

        $sinProducto = $cotizacion->detalles->filter(fn ($detalle) => !$detalle->producto);
        if ($sinProducto->isNotEmpty()) {
            throw new BusinessException("La cotización tiene productos que ya no existen. Edite o cree una nueva cotización.");
        }

        return [
            'cotizacion' => $cotizacion->only(['id', 'serie', 'correlativo', 'total']),
            'cliente' => $cotizacion->cliente,
            'descuento' => (float) $cotizacion->descuento,
            'items' => $cotizacion->detalles->map(fn ($detalle) => [
                'producto' => $detalle->producto,
                'cantidad' => (float) $detalle->cantidad,
                'precio' => $this->precioCotizado($detalle),
            ])->values(),
        ];
    }

    public function precioCotizado(CotizacionDetalle $detalle): float
    {
        return round((float) $detalle->precio_unitario - (float) $detalle->descuento_unitario, 2);
    }

    

    private function calcularTotales(array $detalles, float $descuentoGeneral, float $porcentajeImpuesto): array
    {
        $subtotalGeneral = 0;
        
        foreach ($detalles as $detalle) {
            $precioUnitario = $detalle['precio_unitario'];
            $cantidad = $detalle['cantidad'];
            $descuentoUnitario = $detalle['descuento_unitario'] ?? 0;
            
            $subtotalLinea = ($precioUnitario * $cantidad) - $descuentoUnitario;
            $subtotalGeneral += $subtotalLinea;
        }

        $subtotalGeneral -= $descuentoGeneral;
        $montoImpuesto = $subtotalGeneral * ($porcentajeImpuesto / 100);
        $total = $subtotalGeneral + $montoImpuesto;

        return [
            'subtotal' => $subtotalGeneral,
            'monto_impuesto' => $montoImpuesto,
            'total' => $total,
        ];
    }

    private function sincronizarDetalles(Cotizacion $cotizacion, array $detalles)
    {
        $productosMantenidos = collect($detalles)->pluck('producto_id')->toArray();
        $cotizacion->detalles()->whereNotIn('producto_id', $productosMantenidos)->delete();

        foreach ($detalles as $detalle) {
            $precioUnitario = $detalle['precio_unitario'];
            $cantidad = $detalle['cantidad'];
            $descuentoUnitario = $detalle['descuento_unitario'] ?? 0;
            $subtotalLinea = ($precioUnitario * $cantidad) - $descuentoUnitario;

            CotizacionDetalle::updateOrCreate(
                [
                    'cotizacion_id' => $cotizacion->id,
                    'producto_id' => $detalle['producto_id'],
                ],
                [
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'descuento_unitario' => $descuentoUnitario,
                    'subtotal' => $subtotalLinea,
                ]
            );
        }
    }

    public function cambiarEstado(int $id, string $nuevoEstado, ?string $motivoRechazo = null)
    {
        $cotizacion = Cotizacion::findOrFail($id);

        if ($cotizacion->comprobante_id) {
            throw new BusinessException("No se puede cambiar el estado: la cotización ya fue convertida en venta.");
        }

        if ($nuevoEstado === EstadoCotizacionEnum::RECHAZADA->value) {
            if (empty($motivoRechazo)) {
                throw new BusinessException("Debe proporcionar un motivo para rechazar la cotización.");
            }
            $cotizacion->motivo_rechazo = $motivoRechazo;
        }

        $cotizacion->estado = $nuevoEstado;
        $cotizacion->save();

        return $cotizacion;
    }
}
