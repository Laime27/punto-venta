<?php

namespace App\Services;

use App\Models\HistorialMovimiento;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class KardexService
{
    public function obtenerKardex(int $productoId, array $filtros): array
    {
        $producto = $this->obtenerProducto($productoId);
        $resumen = $this->calcularResumen($producto, $filtros);

        if (!Auth::user()?->can('producto.ver_costo')) {
            $producto->makeHidden('precio_compra');
            $resumen['valor_stock'] = null;
        }

        return [
            'producto' => $producto,
            'resumen' => $resumen,
            'movimientos' => $this->consultarMovimientos($productoId, $filtros)
                ->with(['user:id,name', 'tipoMovimiento:id,nombre', 'documento:id,serie,correlativo'])
                ->orderBy('id')
                ->paginate($filtros['per_page'] ?? 20),
        ];
    }

    public function obtenerMovimientosParaExportar(int $productoId, array $filtros): array
    {
        return [
            'producto' => $this->obtenerProducto($productoId),
            'movimientos' => $this->consultarMovimientos($productoId, $filtros)
                ->with(['user:id,name', 'tipoMovimiento:id,nombre', 'documento:id,serie,correlativo'])
                ->orderBy('id')
                ->get(),
        ];
    }

    private function obtenerProducto(int $productoId): Producto
    {
        return Producto::withTrashed()
            ->with(['unidad:id,nombre,abreviatura', 'categoria:id,nombre'])
            ->findOrFail($productoId);
    }

    private function consultarMovimientos(int $productoId, array $filtros): Builder
    {
        return HistorialMovimiento::where('producto_id', $productoId)
            ->when($filtros['fecha_inicio'] ?? null, fn($query, $fecha) => $query->whereDate('fecha_emision', '>=', $fecha))
            ->when($filtros['fecha_fin'] ?? null, fn($query, $fecha) => $query->whereDate('fecha_emision', '<=', $fecha));
    }

    private function calcularResumen(Producto $producto, array $filtros): array
    {
        $movimientos = $this->consultarMovimientos($producto->id, $filtros);

        $entradas = (float) (clone $movimientos)->where('operacion', '+')->sum('cantidad');
        $salidas = (float) (clone $movimientos)->where('operacion', '-')->sum('cantidad');
        $saldoInicial = $this->calcularSaldoInicial($producto, $filtros['fecha_inicio'] ?? null);

        return [
            'saldo_inicial' => $saldoInicial,
            'entradas' => round($entradas, 2),
            'salidas' => round($salidas, 2),
            'saldo_final' => round($saldoInicial + $entradas - $salidas, 2),
            'stock_actual' => (float) $producto->stock,
            'valor_stock' => round((float) $producto->stock * (float) $producto->precio_compra, 2),
            'total_movimientos' => (clone $movimientos)->count(),
        ];
    }

    private function calcularSaldoInicial(Producto $producto, ?string $fechaInicio): float
    {
        if ($fechaInicio) {
            $movimientoPrevio = HistorialMovimiento::where('producto_id', $producto->id)
                ->whereDate('fecha_emision', '<', $fechaInicio)
                ->orderByDesc('id')
                ->first();

            if ($movimientoPrevio) {
                return (float) $movimientoPrevio->stock_actual;
            }
        }

        $primerMovimiento = HistorialMovimiento::where('producto_id', $producto->id)
            ->when($fechaInicio, fn($query, $fecha) => $query->whereDate('fecha_emision', '>=', $fecha))
            ->orderBy('id')
            ->first();

        return (float) ($primerMovimiento?->stock_anterior ?? $producto->stock);
    }
}
