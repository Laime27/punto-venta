<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Grupo extends Model
{
    use HasFactory;

    protected $table = 'grupos';
    protected $guarded = [];

    public function permisos(): HasMany
    {
        return $this->hasMany(Permiso::class);
    }
}
