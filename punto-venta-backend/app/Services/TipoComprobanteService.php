<?php

namespace App\Services;

use App\Models\TipoComprobante;
use App\Enums\TipoComprobanteEnum;
use Exception;
use App\Exceptions\BusinessException;

class TipoComprobanteService
{

    public function procesarSiguienteCorrelativo(?string $codigoSunat = null)
    {
        $codigoSunat = $codigoSunat ?? TipoComprobanteEnum::TICKET->value;
        $tipoComprobante = TipoComprobante::where('codigo_sunat', $codigoSunat)->first();

        if (!$tipoComprobante) {
            throw new BusinessException("El tipo de comprobante no está configurado en el sistema.");
        }

        $correlativoActual = $tipoComprobante->correlativo;
        $tipoComprobante->increment('correlativo');

        $correlativoFormateado = anteponerCeros($correlativoActual + 1);
        $codigoVenta = $tipoComprobante->serie . '-' . $correlativoFormateado;

        return [
            'tipo_comprobante_id' => $tipoComprobante->id,
            'serie' => $tipoComprobante->serie,
            'correlativo' => $correlativoFormateado,
            'codigo_venta' => $codigoVenta
        ];
    }
}
