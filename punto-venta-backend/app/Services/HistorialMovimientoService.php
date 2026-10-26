<?php

namespace App\Services;

use App\Models\HistorialMovimiento;

class HistorialMovimientoService
{
    public function ListarHistorialMovimientos($perPage = 10)
    {
            return HistorialMovimiento::with([
                'producto:id,nombre,codigo_barras',
                'user:id,name',
                'tipoMovimiento:id,nombre',
                'documento:id,serie,correlativo'
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
                'fecha_emision'
            ])
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }
}
