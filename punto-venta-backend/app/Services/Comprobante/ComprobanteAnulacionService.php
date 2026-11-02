<?php

namespace App\Services\Comprobante;

use App\Models\Comprobante;
use App\Models\Cotizacion;
use App\Models\Producto;
use App\Models\HistorialMovimiento;
use App\Enums\EstadoCajaEnum;
use App\Enums\TipoMovimientoEnum;
use App\Enums\EstadoComprobanteEnum;
use App\Enums\EstadoComprobanteCreditoEnum;
use App\Exceptions\BusinessException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ComprobanteAnulacionService
{
    public function anular(int $id, string $motivo): Comprobante
    {
        return DB::transaction(function () use ($id, $motivo) {
            $comprobante = Comprobante::with(['detalles', 'caja'])->lockForUpdate()->findOrFail($id);

            $this->validarAnulable($comprobante);
            $this->devolverStock($comprobante, $motivo);

            $comprobante->creditos()->update([
                'saldo_pendiente' => 0,
                'estado' => EstadoComprobanteCreditoEnum::ANULADO->value,
            ]);

            $comprobante->update([
                'estado' => EstadoComprobanteEnum::ANULADO->value,
                'motivo_anulacion' => $motivo,
            ]);

            Cotizacion::where('comprobante_id', $comprobante->id)->update(['comprobante_id' => null]);

            return $comprobante->fresh(['detalles', 'pagos', 'creditos', 'cliente', 'tipoComprobante']);
        });
    }

    private function validarAnulable(Comprobante $comprobante): void
    {
        if ($comprobante->estado === EstadoComprobanteEnum::ANULADO->value) {
            throw new BusinessException("El comprobante ya se encuentra anulado.");
        }

        if ($comprobante->caja && $comprobante->caja->estado !== EstadoCajaEnum::ABIERTA->value) {
            throw new BusinessException("No se puede anular una venta de una caja que ya fue cerrada.");
        }
    }

    private function devolverStock(Comprobante $comprobante, string $motivo): void
    {
        $productos = Producto::whereIn('id', $comprobante->detalles->pluck('producto_id'))
            ->orderBy('id')
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($comprobante->detalles as $detalle) {
            $producto = $productos->get($detalle->producto_id);

            if (!$producto || $detalle->cantidad <= 0) {
                continue;
            }

            $stockAnterior = (float) $producto->stock;
            $stockActual = round($stockAnterior + $detalle->cantidad, 2);

            $producto->update(['stock' => $stockActual]);

            HistorialMovimiento::create([
                'producto_id' => $producto->id,
                'user_id' => Auth::id(),
                'tipo_movimiento_id' => TipoMovimientoEnum::ANULACION_VENTA->value,
                'documento_id' => $comprobante->id,
                'documento_type' => Comprobante::class,
                'operacion' => '+',
                'cantidad' => $detalle->cantidad,
                'stock_anterior' => $stockAnterior,
                'stock_actual' => $stockActual,
                'observacion' => "Anulación de venta {$comprobante->serie}-{$comprobante->correlativo}: {$motivo}",
                'fecha_emision' => now(),
            ]);
        }
    }
}
