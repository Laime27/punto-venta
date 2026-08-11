<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoMovimiento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tipos_movimientos';
    protected $guarded = [];

    public function historialMovimientos()
    {
        return $this->hasMany(HistorialMovimiento::class);
    }

}
