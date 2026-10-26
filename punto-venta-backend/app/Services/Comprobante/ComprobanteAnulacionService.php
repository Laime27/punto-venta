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
        $comprobante = Comprobante::with(['detalles', 'creditos', 'caja'])->findOrFail($id);

        if ($comprobante->estado === EstadoComprobanteEnum::ANULADO->value) {
            throw new BusinessException("El comprobante ya se encuentra anulado.");
        }

        if ($comprobante->caja && $comprobante->caja->estado !== EstadoCajaEnum::ABIERTA->value) {
            throw new BusinessException("No se puede anular una venta de una caja que ya fue cerrada.");
        }

        return DB::transaction(function () use ($comprobante, $motivo) {
            foreach ($comprobante->detalles as $detalle) {
                $producto = Producto::find($detalle->producto_id);

                if ($producto && $detalle->cantidad > 0) {
                    $stockAnterior = $producto->stock;
                    $stockActual = $stockAnterior + $detalle->cantidad;

                    $producto->update(['stock' => $stockActual]);

                    HistorialMovimiento::create([
                        'producto_id' => $producto->id,
                        'user_id' => Auth::id() ?? 1,
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

            foreach ($comprobante->creditos as $credito) {
                $credito->update([
                    'saldo_pendiente' => 0,
                    'estado' => EstadoComprobanteCreditoEnum::PAGADO->value,
                ]);
            }

            $comprobante->update([
                'estado' => EstadoComprobanteEnum::ANULADO->value,
                'motivo_anulacion' => $motivo,
            ]);

            Cotizacion::where('comprobante_id', $comprobante->id)->update(['comprobante_id' => null]);

            return $comprobante->fresh(['detalles', 'pagos', 'creditos', 'cliente', 'tipoComprobante']);
        });
    }
}
