<?php

namespace App\Services\Reporte;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReporteInventarioService
{
    private const LIMITE_TOP = 10;
    public const FACTOR_POR_AGOTARSE = 1.5;

    public function inventario(array $filtros): array
    {
        $factor = self::FACTOR_POR_AGOTARSE;

        $totales = $this->consultaProductos($filtros)
            ->selectRaw("
                COUNT(*) as productos,
                COALESCE(SUM(productos.stock), 0) as unidades,
                COALESCE(SUM(productos.stock * productos.precio_compra), 0) as valor_costo,
                COALESCE(SUM(productos.stock * productos.precio_venta), 0) as valor_venta,
                COALESCE(SUM(CASE WHEN productos.stock <= productos.stock_minimo THEN 1 ELSE 0 END), 0) as stock_bajo,
                COALESCE(SUM(CASE WHEN productos.stock > productos.stock_minimo AND productos.stock <= productos.stock_minimo * {$factor} THEN 1 ELSE 0 END), 0) as por_agotarse
            ")
            ->first();

        return [
            'indicadores' => [
                'total_productos' => (int) $totales->productos,
                'total_unidades' => round((float) $totales->unidades, 2),
                'valor_costo' => round((float) $totales->valor_costo, 2),
                'valor_venta' => round((float) $totales->valor_venta, 2),
                'utilidad_potencial' => round((float) $totales->valor_venta - (float) $totales->valor_costo, 2),
                'productos_stock_bajo' => (int) $totales->stock_bajo,
                'productos_por_agotarse' => (int) $totales->por_agotarse,
            ],
            'por_categoria' => $this->valorPorCategoria($filtros),
            'mayor_inversion' => $this->listadoProductos($filtros)
                ->reorder()
                ->orderByRaw('productos.stock * productos.precio_compra DESC')
                ->limit(self::LIMITE_TOP)
                ->get()
                ->map(fn($fila) => $this->mapearProducto($fila)),
        ];
    }

    public function productosConStockBajo(int $limite): Collection
    {
        return $this->listadoProductos(['solo_stock_bajo' => true])
            ->reorder()
            ->orderByRaw('productos.stock - productos.stock_minimo')
            ->limit($limite)
            ->get()
            ->map(fn ($fila) => $this->mapearProducto($fila));
    }

    public function productosPaginados(array $filtros): LengthAwarePaginator
    {
        return $this->listadoProductos($filtros)
            ->paginate($filtros['per_page'])
            ->through(fn($fila) => $this->mapearProducto($fila));
    }

    public function productos(array $filtros): Collection
    {
        return $this->listadoProductos($filtros)->get()->map(fn($fila) => $this->mapearProducto($fila));
    }

    public function perdidas(array $filtros): array
    {
        $porTipo = $this->ajustesConPerdida($filtros)
            ->join('tipos_movimientos', 'tipos_movimientos.id', '=', 'ajustes_inventario.tipo_movimiento_id')
            ->groupBy('tipos_movimientos.id', 'tipos_movimientos.nombre')
            ->selectRaw('
                tipos_movimientos.id,
                tipos_movimientos.nombre as tipo,
                COUNT(DISTINCT ajustes_inventario.id) as ajustes,
                SUM(-ajuste_inventario_detalles.diferencia) as unidades,
                SUM(-ajuste_inventario_detalles.diferencia * ajuste_inventario_detalles.costo_unitario) as valor
            ')
            ->orderByDesc('valor')
            ->get()
            ->map(fn($fila) => [
                'id' => $fila->id,
                'tipo' => $fila->tipo,
                'ajustes' => (int) $fila->ajustes,
                'unidades' => round((float) $fila->unidades, 2),
                'valor' => round((float) $fila->valor, 2),
            ]);

        return [
            'indicadores' => [
                'total_unidades' => round($porTipo->sum('unidades'), 2),
                'valor_total' => round($porTipo->sum('valor'), 2),
                'total_ajustes' => $porTipo->sum('ajustes'),
                'productos_afectados' => $this->ajustesConPerdida($filtros)->distinct()->count('ajuste_inventario_detalles.producto_id'),
            ],
            'por_tipo' => $porTipo->values(),
            'mas_afectados' => $this->consultaPerdidasProducto($filtros)->limit(self::LIMITE_TOP)->get()->map(fn($fila) => $this->mapearPerdida($fila)),
        ];
    }

    public function perdidasPaginadas(array $filtros): LengthAwarePaginator
    {
        return $this->consultaPerdidasProducto($filtros)
            ->paginate($filtros['per_page'])
            ->through(fn($fila) => $this->mapearPerdida($fila));
    }

    public function perdidasPorProducto(array $filtros): Collection
    {
        return $this->consultaPerdidasProducto($filtros)->get()->map(fn($fila) => $this->mapearPerdida($fila));
    }

    private function valorPorCategoria(array $filtros): Collection
    {
        return $this->consultaProductos($filtros)
            ->leftJoin('categorias', 'categorias.id', '=', 'productos.categoria_id')
            ->groupBy('categorias.id', 'categorias.nombre')
            ->selectRaw("
                categorias.id,
                COALESCE(categorias.nombre, 'Sin categoría') as nombre,
                COUNT(*) as productos,
                SUM(productos.stock * productos.precio_compra) as valor_costo,
                SUM(productos.stock * productos.precio_venta) as valor_venta
            ")
            ->orderByDesc('valor_costo')
            ->get()
            ->map(fn($fila) => [
                'id' => $fila->id,
                'nombre' => $fila->nombre,
                'productos' => (int) $fila->productos,
                'valor_costo' => round((float) $fila->valor_costo, 2),
                'valor_venta' => round((float) $fila->valor_venta, 2),
            ]);
    }

    private function listadoProductos(array $filtros): Builder
    {
        return $this->consultaProductos($filtros)
            ->leftJoin('categorias', 'categorias.id', '=', 'productos.categoria_id')
            ->selectRaw("
                productos.id,
                productos.nombre,
                productos.codigo_barras,
                COALESCE(categorias.nombre, 'Sin categoría') as categoria,
                productos.stock,
                productos.stock_minimo,
                productos.precio_compra,
                productos.precio_venta
            ")
            ->orderBy('productos.nombre');
    }

    private function consultaProductos(array $filtros): Builder
    {
        return DB::table('productos')
            ->whereNull('productos.deleted_at')
            ->when($filtros['categoria_id'] ?? null, fn($query, $categoriaId) => $query->where('productos.categoria_id', $categoriaId))
            ->when($filtros['producto_id'] ?? null, fn($query, $productoId) => $query->where('productos.id', $productoId))
            ->when($filtros['solo_stock_bajo'] ?? false, fn($query) => $query->whereColumn('productos.stock', '<=', 'productos.stock_minimo'));
    }

    private function consultaPerdidasProducto(array $filtros): Builder
    {
        return $this->ajustesConPerdida($filtros)
            ->join('productos', 'productos.id', '=', 'ajuste_inventario_detalles.producto_id')
            ->groupBy('productos.id', 'productos.nombre', 'productos.codigo_barras')
            ->selectRaw('
                productos.id,
                productos.nombre,
                productos.codigo_barras,
                SUM(-ajuste_inventario_detalles.diferencia) as unidades,
                SUM(-ajuste_inventario_detalles.diferencia * ajuste_inventario_detalles.costo_unitario) as valor
            ')
            ->orderByDesc('valor');
    }

    private function ajustesConPerdida(array $filtros): Builder
    {
        return DB::table('ajuste_inventario_detalles')
            ->join('ajustes_inventario', 'ajustes_inventario.id', '=', 'ajuste_inventario_detalles.ajuste_inventario_id')
            ->whereNull('ajustes_inventario.deleted_at')
            ->where('ajuste_inventario_detalles.diferencia', '<', 0)
            ->whereDate('ajustes_inventario.fecha_emision', '>=', $filtros['fecha_inicio'])
            ->whereDate('ajustes_inventario.fecha_emision', '<=', $filtros['fecha_fin']);
    }

    private function estadoStock(float $stock, float $stockMinimo): string
    {
        return match (true) {
            $stock <= $stockMinimo => 'bajo',
            $stock <= $stockMinimo * self::FACTOR_POR_AGOTARSE => 'por_agotarse',
            default => 'normal',
        };
    }

    private function mapearProducto(object $fila): array
    {
        return [
            'id' => $fila->id,
            'nombre' => $fila->nombre,
            'codigo_barras' => $fila->codigo_barras,
            'categoria' => $fila->categoria,
            'stock' => (float) $fila->stock,
            'stock_minimo' => (float) $fila->stock_minimo,
            'precio_compra' => (float) $fila->precio_compra,
            'precio_venta' => (float) $fila->precio_venta,
            'valor_costo' => round((float) $fila->stock * (float) $fila->precio_compra, 2),
            'valor_venta' => round((float) $fila->stock * (float) $fila->precio_venta, 2),
            'estado_stock' => $this->estadoStock((float) $fila->stock, (float) $fila->stock_minimo),
        ];
    }

    private function mapearPerdida(object $fila): array
    {
        return [
            'id' => $fila->id,
            'nombre' => $fila->nombre,
            'codigo_barras' => $fila->codigo_barras,
            'unidades' => round((float) $fila->unidades, 2),
            'valor' => round((float) $fila->valor, 2),
        ];
    }
}
