<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unidad extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'unidades';
    protected $guarded = [];

    protected $casts = [
        'permite_decimales' => 'boolean',
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

}
