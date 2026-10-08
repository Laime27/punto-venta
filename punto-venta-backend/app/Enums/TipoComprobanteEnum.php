<?php

namespace App\Enums;

enum TipoComprobanteEnum: string
{
    case FACTURA = '01';
    case BOLETA = '03';
    case TICKET = '00';
    case ORDEN_COMPRA = 'OC';
    case COTIZACION = 'CT';
}
