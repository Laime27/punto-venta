<?php

namespace App\Services;

use App\Models\HistorialMovimiento;
use App\Models\TipoMovimiento;

class HistorialMovimientoService
{
    public function listarHistorialMovimientos(array $filtros)
    {
        return HistorialMovimiento::with([
                'producto:id,nombre,codigo_barras',
                'user:id,name',
                'tipoMovimiento:id,nombre',
                'documento:id,serie,correlativo',
            ])
            ->select([
                'id',
                'producto_id',
                'user_id',
                'tipo_movimiento_id',
                'documento_id',
                'documento_type',
                'operacion',
                'cantidad',
                'stock_anterior',
                'stock_actual',
                'observacion',
                'fecha_emision',
            ])
            ->when($filtros['search'] ?? null, function ($query, $search) {
                $query->whereHas('producto', fn($q) => $q->withTrashed()->where(
                    fn($q) => $q->where('nombre', 'like', "%{$search}%")->orWhere('codigo_barras', 'like', "%{$search}%")
                ));
            })
            ->when($filtros['tipo_movimiento_id'] ?? null, fn($query, $tipo) => $query->where('tipo_movimiento_id', $tipo))
            ->when($filtros['operacion'] ?? null, fn($query, $operacion) => $query->where('operacion', $operacion))
            ->when($filtros['fecha_inicio'] ?? null, fn($query, $fecha) => $query->whereDate('fecha_emision', '>=', $fecha))
            ->when($filtros['fecha_fin'] ?? null, fn($query, $fecha) => $query->whereDate('fecha_emision', '<=', $fecha))
            ->orderBy('id', 'desc')
            ->paginate($filtros['per_page'] ?? 10);
    }

    public function listarTipos()
    {
        return TipoMovimiento::orderBy('id')->get(['id', 'nombre']);
    }
}
