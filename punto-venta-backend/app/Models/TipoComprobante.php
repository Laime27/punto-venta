<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoComprobante extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tipos_comprobantes';
    protected $guarded = [];

    public function comprobantes()
    {
        return $this->hasMany(Comprobante::class);
    }

}
