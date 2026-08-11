<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MetodoPago extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'metodos_pagos';
    protected $guarded = [];

    public function comprobantePagos()
    {
        return $this->hasMany(ComprobantePago::class);
    }

}
