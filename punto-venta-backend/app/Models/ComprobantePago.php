<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComprobantePago extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'comprobante_pagos';
    protected $guarded = [];

    public function comprobante()
    {
        return $this->belongsTo(Comprobante::class);
    }

    public function caja()
    {
        return $this->belongsTo(Caja::class);
    }

    public function metodoPago()
    {
        return $this->belongsTo(MetodoPago::class, 'metodo_pago_id');
    }

}
