<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'productos';
    protected $guarded = [];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function proveedores()
    {
        return $this->belongsToMany(Proveedor::class, 'producto_proveedor');
    }

    public function unidad()
    {
        return $this->belongsTo(Unidad::class);
    }

    public function historialMovimientos()
    {
        return $this->hasMany(HistorialMovimiento::class);
    }

    public function comprobanteDetalles()
    {
        return $this->hasMany(ComprobanteDetalle::class);
    }
}
