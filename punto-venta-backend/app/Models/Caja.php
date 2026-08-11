<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Caja extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'cajas';
    protected $guarded = [];

    public function abiertoPor()
    {
        return $this->belongsTo(User::class, 'abierto_por');
    }

    public function cerradoPor()
    {
        return $this->belongsTo(User::class, 'cerrado_por');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoCaja::class);
    }

    public function comprobantes()
    {
        return $this->hasMany(Comprobante::class);
    }

}
