<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AjusteInventario extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ajustes_inventario';

    protected $fillable = [
        'serie_id',
        'serie',
        'correlativo',
        'tipo_movimiento_id',
        'motivo',
        'fecha_emision',
        'user_id',
    ];

    protected $casts = [
        'fecha_emision' => 'datetime:Y-m-d H:i:s',
    ];

    public function tipoMovimiento()
    {
        return $this->belongsTo(TipoMovimiento::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(AjusteInventarioDetalle::class, 'ajuste_inventario_id');
    }

    public function historialMovimientos()
    {
        return $this->morphMany(HistorialMovimiento::class, 'documento');
    }
}
