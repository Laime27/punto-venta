<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrdenCompra extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'orden_compras';

    protected $fillable = [
        'proveedor_id',
        'user_id',
        'serie_id',
        'fecha_emision',
        'fecha_recepcion',
        'estado',
        'total_estimado',
        'total_real',
        'serie',
        'correlativo',
        'observaciones',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(OrdenCompraDetalle::class, 'orden_compra_id');
    }
}
