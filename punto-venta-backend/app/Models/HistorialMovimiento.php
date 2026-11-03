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

    private const NOMBRES_DOCUMENTO = [
        Comprobante::class => 'Comprobante',
        OrdenCompra::class => 'Orden de compra',
        AjusteInventario::class => 'Ajuste de inventario',
    ];

    public function getNombreDocumentoAttribute()
    {
        if (!$this->documento_type) {
            return ' ';
        }
        
        return self::NOMBRES_DOCUMENTO[$this->documento_type] ?? class_basename($this->documento_type);
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
