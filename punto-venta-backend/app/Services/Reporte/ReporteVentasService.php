<?php

namespace App\Services\Reporte;

use App\Enums\EstadoComprobanteEnum;
use App\Enums\FormaPagoEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReporteVentasService
{
    private const LIMITE_TOP = 10;
    private const DIAS_MAXIMOS_AGRUPACION_DIARIA = 62;

    public function resumen(array $filtros): array
    {
        return [
            'indicadores' => $this->indicadoresVentas($filtros),
            'agrupacion' => $this->agrupacion($filtros),
            'periodos' => $this->ventasPorPeriodo($filtros),
            'metodos_pago' => $this->metodosPago($filtros),
            'categorias' => $this->categorias($filtros),
            'mas_vendidos' => $this->masVendidos($filtros),
            'menos_vendidos' => $this->menosVendidos($filtros),
        ];
    }

    public function rentabilidad(array $filtros): array
    {
        return [
            'indicadores' => $this->indicadoresRentabilidad($filtros),
            'mayores_ingresos' => $this->consultaProductos($filtros)->orderByDesc('ingresos')->limit(self::LIMITE_TOP)->get()->map(fn($fila) => $this->conUtilidad($fila)),
            'mayor_utilidad' => $this->consultaProductos($filtros)->orderByRaw('SUM(comprobante_detalles.subtotal) - SUM(comprobante_detalles.cantidad * comprobante_detalles.costo_unitario) DESC')->limit(self::LIMITE_TOP)->get()->map(fn($fila) => $this->conUtilidad($fila)),
        ];
    }

    public function productosPaginados(array $filtros): LengthAwarePaginator
    {
        return $this->consultaProductos($filtros)
            ->orderByDesc('ingresos')
            ->paginate($filtros['per_page'])
            ->through(fn($fila) => $this->conUtilidad($fila));
    }

    public function productos(array $filtros): Collection
    {
        return $this->consultaProductos($filtros)
            ->orderByDesc('ingresos')
            ->get()
            ->map(fn($fila) => $this->conUtilidad($fila));
    }

    public function listarVendedores(?string $search): Collection
    {
        return DB::table('users')
            ->when($search, fn($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->limit(20)
            ->get(['id', 'name as nombre']);
    }

    public function nombreVendedor(?int $userId): ?string
    {
        return $userId ? DB::table('users')->where('id', $userId)->value('name') : null;
    }

    private function indicadoresVentas(array $filtros): array
    {
        $ventas = $this->ventasActivas($filtros);
        $anuladas = $this->ventasEnRango($filtros)->where('comprobantes.estado', EstadoComprobanteEnum::ANULADO->value);

        $totalVentas = (float) (clone $ventas)->sum('comprobantes.total');
        $costoVentas = (float) $this->detallesVendidos($filtros)
            ->sum(DB::raw('comprobante_detalles.cantidad * comprobante_detalles.costo_unitario'));

        return [
            'total_ventas' => round($totalVentas, 2),
            'cantidad_ventas' => (clone $ventas)->count(),
            'total_descuentos' => round((float) (clone $ventas)->sum('comprobantes.descuento'), 2),
            'total_contado' => round((float) (clone $ventas)->where('comprobantes.forma_pago', FormaPagoEnum::CONTADO->value)->sum('comprobantes.total'), 2),
            'total_credito' => round((float) (clone $ventas)->where('comprobantes.forma_pago', FormaPagoEnum::CREDITO->value)->sum('comprobantes.total'), 2),
            'costo_ventas' => round($costoVentas, 2),
            'utilidad_bruta' => round($totalVentas - $costoVentas, 2),
            'margen' => $this->porcentaje($totalVentas - $costoVentas, $totalVentas),
            'cantidad_anuladas' => (clone $anuladas)->count(),
            'monto_anulado' => round((float) (clone $anuladas)->sum('comprobantes.total'), 2),
        ];
    }

    private function indicadoresRentabilidad(array $filtros): array
    {
        $totales = $this->detallesFiltrados($filtros)
            ->selectRaw('
                COUNT(DISTINCT comprobante_detalles.producto_id) as productos,
                COALESCE(SUM(comprobante_detalles.cantidad), 0) as cantidad,
                COALESCE(SUM(comprobante_detalles.subtotal), 0) as ingresos,
                COALESCE(SUM(comprobante_detalles.cantidad * comprobante_detalles.costo_unitario), 0) as costo
            ')
            ->first();

        $ingresos = (float) $totales->ingresos;
        $costo = (float) $totales->costo;

        return [
            'productos_vendidos' => (int) $totales->productos,
            'unidades_vendidas' => round((float) $totales->cantidad, 2),
            'ingresos' => round($ingresos, 2),
            'costo' => round($costo, 2),
            'utilidad' => round($ingresos - $costo, 2),
            'margen' => $this->porcentaje($ingresos - $costo, $ingresos),
        ];
    }

    private function agrupacion(array $filtros): string
    {
        $dias = Carbon::parse($filtros['fecha_inicio'])->diffInDays(Carbon::parse($filtros['fecha_fin']));

        return $dias > self::DIAS_MAXIMOS_AGRUPACION_DIARIA ? 'mes' : 'dia';
    }

    private function ventasPorPeriodo(array $filtros): Collection
    {
        $porDia = $this->ventasActivas($filtros)
            ->selectRaw('DATE(comprobantes.fecha_emision) as fecha, COUNT(*) as cantidad, SUM(comprobantes.total) as total')
            ->groupByRaw('DATE(comprobantes.fecha_emision)')
            ->orderBy('fecha')
            ->get();

        $longitudPeriodo = $this->agrupacion($filtros) === 'mes' ? 7 : 10;

        return $porDia
            ->groupBy(fn($fila) => substr($fila->fecha, 0, $longitudPeriodo))
            ->map(fn($filas, $periodo) => [
                'periodo' => $periodo,
                'cantidad' => (int) $filas->sum('cantidad'),
                'total' => round((float) $filas->sum('total'), 2),
            ])
            ->values();
    }

    private function metodosPago(array $filtros): Collection
    {
        $filas = DB::table('comprobante_pagos')
            ->join('comprobantes', 'comprobantes.id', '=', 'comprobante_pagos.comprobante_id')
            ->join('metodos_pagos', 'metodos_pagos.id', '=', 'comprobante_pagos.metodo_pago_id')
            ->whereNull('comprobante_pagos.deleted_at')
            ->whereNull('comprobantes.deleted_at')
            ->where('comprobantes.estado', '!=', EstadoComprobanteEnum::ANULADO->value)
            ->when($filtros['user_id'] ?? null, fn($query, $userId) => $query->where('comprobantes.user_id', $userId))
            ->whereDate('comprobante_pagos.created_at', '>=', $filtros['fecha_inicio'])
            ->whereDate('comprobante_pagos.created_at', '<=', $filtros['fecha_fin'])
            ->groupBy('metodos_pagos.id', 'metodos_pagos.nombre')
            ->selectRaw('
                metodos_pagos.id,
                metodos_pagos.nombre,
                COUNT(*) as operaciones,
                SUM(comprobante_pagos.monto - comprobante_pagos.monto_devuelto) as total
            ')
            ->orderByDesc('total')
            ->get();

        return $this->conParticipacion($filas, fn($fila) => [
            'id' => $fila->id,
            'nombre' => $fila->nombre,
            'operaciones' => (int) $fila->operaciones,
            'total' => round((float) $fila->total, 2),
        ]);
    }

    private function categorias(array $filtros): Collection
    {
        $filas = $this->detallesVendidos($filtros)
            ->join('productos', 'productos.id', '=', 'comprobante_detalles.producto_id')
            ->leftJoin('categorias', 'categorias.id', '=', 'productos.categoria_id')
            ->groupBy('categorias.id', 'categorias.nombre')
            ->selectRaw("
                categorias.id,
                COALESCE(categorias.nombre, 'Sin categoría') as nombre,
                SUM(comprobante_detalles.cantidad) as cantidad,
                SUM(comprobante_detalles.subtotal) as total
            ")
            ->orderByDesc('total')
            ->get();

        return $this->conParticipacion($filas, fn($fila) => [
            'id' => $fila->id,
            'nombre' => $fila->nombre,
            'cantidad' => round((float) $fila->cantidad, 2),
            'total' => round((float) $fila->total, 2),
        ]);
    }

    private function masVendidos(array $filtros): Collection
    {
        return $this->consultaProductos($filtros)
            ->orderByDesc('cantidad')
            ->limit(self::LIMITE_TOP)
            ->get()
            ->map(fn($fila) => ['id' => $fila->id, 'nombre' => $fila->nombre, 'cantidad' => round((float) $fila->cantidad, 2)]);
    }

    private function menosVendidos(array $filtros): Collection
    {
        $vendidos = $this->detallesVendidos($filtros)
            ->groupBy('comprobante_detalles.producto_id')
            ->selectRaw('comprobante_detalles.producto_id, SUM(comprobante_detalles.cantidad) as cantidad');

        return DB::table('productos')
            ->leftJoinSub($vendidos, 'vendidos', 'vendidos.producto_id', '=', 'productos.id')
            ->whereNull('productos.deleted_at')
            ->where('productos.disponible_venta', true)
            ->selectRaw('productos.id, productos.nombre, COALESCE(vendidos.cantidad, 0) as cantidad')
            ->orderBy('cantidad')
            ->orderBy('productos.nombre')
            ->limit(self::LIMITE_TOP)
            ->get()
            ->map(fn($fila) => ['id' => $fila->id, 'nombre' => $fila->nombre, 'cantidad' => round((float) $fila->cantidad, 2)]);
    }

    private function consultaProductos(array $filtros): Builder
    {
        return $this->detallesFiltrados($filtros)
            ->leftJoin('categorias', 'categorias.id', '=', 'productos.categoria_id')
            ->groupBy('productos.id', 'productos.nombre', 'productos.codigo_barras', 'categorias.nombre')
            ->selectRaw("
                productos.id,
                productos.nombre,
                productos.codigo_barras,
                COALESCE(categorias.nombre, 'Sin categoría') as categoria,
                SUM(comprobante_detalles.cantidad) as cantidad,
                SUM(comprobante_detalles.subtotal) as ingresos,
                SUM(comprobante_detalles.cantidad * comprobante_detalles.costo_unitario) as costo
            ");
    }

    private function detallesFiltrados(array $filtros): Builder
    {
        return $this->detallesVendidos($filtros)
            ->join('productos', 'productos.id', '=', 'comprobante_detalles.producto_id')
            ->when($filtros['categoria_id'] ?? null, fn($query, $categoriaId) => $query->where('productos.categoria_id', $categoriaId))
            ->when($filtros['producto_id'] ?? null, fn($query, $productoId) => $query->where('productos.id', $productoId));
    }

    private function ventasEnRango(array $filtros): Builder
    {
        return DB::table('comprobantes')
            ->whereNull('comprobantes.deleted_at')
            ->when($filtros['user_id'] ?? null, fn($query, $userId) => $query->where('comprobantes.user_id', $userId))
            ->whereDate('comprobantes.fecha_emision', '>=', $filtros['fecha_inicio'])
            ->whereDate('comprobantes.fecha_emision', '<=', $filtros['fecha_fin']);
    }

    private function ventasActivas(array $filtros): Builder
    {
        return $this->ventasEnRango($filtros)
            ->where('comprobantes.estado', '!=', EstadoComprobanteEnum::ANULADO->value);
    }

    private function detallesVendidos(array $filtros): Builder
    {
        return $this->ventasActivas($filtros)
            ->join('comprobante_detalles', 'comprobante_detalles.comprobante_id', '=', 'comprobantes.id')
            ->whereNull('comprobante_detalles.deleted_at');
    }

    private function conParticipacion(Collection $filas, callable $mapear): Collection
    {
        $totalGeneral = (float) $filas->sum('total');

        return $filas->map(fn($fila) => [
            ...$mapear($fila),
            'participacion' => $this->porcentaje((float) $fila->total, $totalGeneral),
        ]);
    }

    private function conUtilidad(object $fila): array
    {
        $ingresos = (float) $fila->ingresos;
        $costo = (float) $fila->costo;

        return [
            'id' => $fila->id,
            'nombre' => $fila->nombre,
            'codigo_barras' => $fila->codigo_barras,
            'categoria' => $fila->categoria,
            'cantidad' => round((float) $fila->cantidad, 2),
            'ingresos' => round($ingresos, 2),
            'costo' => round($costo, 2),
            'utilidad' => round($ingresos - $costo, 2),
            'margen' => $this->porcentaje($ingresos - $costo, $ingresos),
        ];
    }

    private function porcentaje(float $parte, float $total): float
    {
        return $total > 0 ? round($parte / $total * 100, 2) : 0;
    }
}
