<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HistorialMovimiento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'historial_movimientos';
    protected $guarded = [];

   

    protected $appends = ['nombre_documento'];

    public function getNombreDocumentoAttribute()
    {
        if (!$this->documento_type) {
            return ' ';
        }
        
        $partes = explode('\\', $this->documento_type);
        return end($partes);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class)->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tipoMovimiento()
    {
        return $this->belongsTo(TipoMovimiento::class);
    }

    public function documento()
    {
        return $this->morphTo();
    }

}
