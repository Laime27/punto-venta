<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComprobanteDetalle extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'comprobante_detalles';
    protected $guarded = [];

    public function comprobante()
    {
        return $this->belongsTo(Comprobante::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

}
