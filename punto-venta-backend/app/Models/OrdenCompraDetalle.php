<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdenCompraDetalle extends Model
{
    use HasFactory;

    protected $table = 'orden_compra_detalles';

    protected $fillable = [
        'orden_compra_id',
        'producto_id',
        'cantidad_pedida',
        'cantidad_recibida',
        'precio_unitario',
        'subtotal',
    ];

    public function ordenCompra()
    {
        return $this->belongsTo(OrdenCompra::class, 'orden_compra_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
