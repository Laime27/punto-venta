<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComprobanteCredito extends Model
{
    protected $fillable = [
        'comprobante_id',
        'fecha',
        'monto',
        'saldo_pendiente',
        'estado'
    ];

    public function comprobante()
    {
        return $this->belongsTo(Comprobante::class);
    }
}
