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

            if (in_array($ordenCompra->estado, [EstadoOrdenCompraEnum::ANULADA->value, EstadoOrdenCompraEnum::RECIBIDA_COMPLETA->value])) {
                throw new BusinessException("La orden de compra no puede ser recibida en su estado actual.");
            }

            $productos = Producto::whereIn('id', $ordenCompra->detalles->pluck('producto_id'))
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $huboRecepcion = false;

            foreach ($data['detalles'] as $itemRecibido) {
                $detalle = $ordenCompra->detalles->firstWhere('id', $itemRecibido['id']);

                if (!$detalle) {
                    throw new BusinessException("Uno de los productos no pertenece a esta orden de compra.");
                }

                $cantidadAIncrementar = $this->validarCantidad($detalle, $productos->get($detalle->producto_id), (float) $itemRecibido['cantidad_recibida']);

                if ($cantidadAIncrementar <= 0) {
                    continue;
                }

                $huboRecepcion = true;
                $detalle->cantidad_recibida = (float) $itemRecibido['cantidad_recibida'];
                $detalle->subtotal = $detalle->cantidad_recibida * $detalle->precio_unitario;
                $detalle->save();

                $this->actualizarStockHistorial($productos->get($detalle->producto_id), $detalle, $cantidadAIncrementar, $ordenCompra->id);
            }

            if (!$huboRecepcion) {
                throw new BusinessException("Ingresa al menos una cantidad mayor a la ya recibida.");
            }

            $todasCompletas = $ordenCompra->detalles->every(fn ($detalle) => (float) $detalle->cantidad_recibida >= (float) $detalle->cantidad_pedida);

            $ordenCompra->total_real = $ordenCompra->detalles->sum(fn ($detalle) => (float) $detalle->cantidad_recibida * (float) $detalle->precio_unitario);
            $ordenCompra->estado = $todasCompletas ? EstadoOrdenCompraEnum::RECIBIDA_COMPLETA->value : EstadoOrdenCompraEnum::RECIBIDA_PARCIAL->value;
            $ordenCompra->fecha_recepcion = now();
            $ordenCompra->save();

            return $ordenCompra->load('detalles.producto');
        });
    }

    private function validarCantidad($detalle, Producto $producto, float $cantidadRecibida): float
    {
        $yaRecibido = (float) $detalle->cantidad_recibida;
        $pedido = (float) $detalle->cantidad_pedida;

        if ($cantidadRecibida < $yaRecibido) {
            throw new BusinessException("La cantidad de {$producto->nombre} no puede ser menor a lo ya recibido ({$yaRecibido}).");
        }

        if ($cantidadRecibida > $pedido) {
            throw new BusinessException("La cantidad de {$producto->nombre} no puede superar lo pedido ({$pedido}).");
        }

        return round($cantidadRecibida - $yaRecibido, 2);
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
