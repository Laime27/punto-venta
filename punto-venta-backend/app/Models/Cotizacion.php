<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cotizacion extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'cotizaciones';

    protected $fillable = [
        'serie_id',
        'serie',
        'correlativo',
        'cliente_id',
        'fecha_emision',
        'fecha_vencimiento',
        'estado',
        'motivo_rechazo',
        'subtotal',
        'descuento',
        'porcentaje_impuesto',
        'monto_impuesto',
        'total',
        'observaciones',
        'user_id',
        'comprobante_id',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_vencimiento' => 'date',
    ];


    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function comprobante()
    {
        return $this->belongsTo(Comprobante::class);
    }

    public function detalles()
    {
        return $this->hasMany(CotizacionDetalle::class);
    }
}
