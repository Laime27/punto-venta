<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AjusteInventarioDetalle extends Model
{
    use HasFactory;

    protected $table = 'ajuste_inventario_detalles';

    protected $fillable = [
        'ajuste_inventario_id',
        'producto_id',
        'cantidad',
        'stock_anterior',
        'stock_actual',
        'diferencia',
        'costo_unitario',
    ];

    public function ajusteInventario()
    {
        return $this->belongsTo(AjusteInventario::class, 'ajuste_inventario_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class)->withTrashed();
    }
}
