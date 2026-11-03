<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'clientes';
    protected $guarded = [];

    protected $casts = [
        'es_sistema' => 'boolean',
    ];

    public function comprobantes()
    {
        return $this->hasMany(Comprobante::class);
    }

}
