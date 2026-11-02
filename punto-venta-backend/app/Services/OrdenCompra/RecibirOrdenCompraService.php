<?php

namespace App\Services\OrdenCompra;

use App\Models\OrdenCompra;
use App\Models\Producto;
use App\Models\HistorialMovimiento;
use App\Enums\EstadoOrdenCompraEnum;
use App\Enums\TipoMovimientoEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\BusinessException;

class RecibirOrdenCompraService
{
    public function recibir(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $ordenCompra = OrdenCompra::with('detalles')->lockForUpdate()->findOrFail($id);

            if ($ordenCompra->estado === EstadoOrdenCompraEnum::ANULADA->value) {
                throw new BusinessException("La orden de compra no puede ser recibida en su estado actual.");
            }

            $productos = Producto::whereIn('id', $ordenCompra->detalles->pluck('producto_id'))
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $totalReal = 0;
            $todasCompletas = true;

            foreach ($data['detalles'] ?? [] as $itemRecibido) {
                $detalle = $ordenCompra->detalles->where('id', $itemRecibido['id'])->first();
                
                if ($detalle) {
                    $cantidadAIncrementar = $itemRecibido['cantidad_recibida'] - $detalle->cantidad_recibida;
                    $detalle->cantidad_recibida = $itemRecibido['cantidad_recibida'];
                    $detalle->subtotal = $detalle->cantidad_recibida * $detalle->precio_unitario;
                    $detalle->save();

                    $totalReal += $detalle->subtotal;

                    if ($detalle->cantidad_recibida < $detalle->cantidad_pedida) {
                        $todasCompletas = false;
                    }

                    if ($cantidadAIncrementar > 0) {
                        $this->actualizarStockHistorial($productos->get($detalle->producto_id), $detalle, $cantidadAIncrementar, $ordenCompra->id);
                    }
                }
            }

            $ordenCompra->total_real = $totalReal;
            $ordenCompra->estado = $todasCompletas ? EstadoOrdenCompraEnum::RECIBIDA_COMPLETA->value : EstadoOrdenCompraEnum::RECIBIDA_PARCIAL->value;
            $ordenCompra->fecha_recepcion = now();
            $ordenCompra->save();

            return $ordenCompra->load('detalles.producto');
        });
    }

    private function actualizarStockHistorial(Producto $producto, $detalle, $cantidadAIncrementar, $ordenCompraId)
    {
        $stockAnterior = (float) $producto->stock;
        $producto->update([
            'stock' => round($stockAnterior + $cantidadAIncrementar, 2),
            'precio_compra' => $detalle->precio_unitario,
        ]);

        HistorialMovimiento::create([
            'producto_id' => $producto->id,
            'user_id' => Auth::id(),
            'tipo_movimiento_id' => TipoMovimientoEnum::COMPRA->value,
            'documento_id' => $ordenCompraId,
            'documento_type' => OrdenCompra::class,
            'operacion' => '+',
            'cantidad' => $cantidadAIncrementar,
            'stock_anterior' => $stockAnterior,
            'stock_actual' => $producto->stock,
            'observacion' => 'Ingreso por Orden de Compra #' . $ordenCompraId,
            'fecha_emision' => now(),
        ]);
    }
}
