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

        return Cotizacion::with(['cliente', 'user'])->orderBy('id', 'desc')->paginate(10);
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
        return Cotizacion::with(['cliente', 'user', 'detalles.producto'])->findOrFail($id);
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
