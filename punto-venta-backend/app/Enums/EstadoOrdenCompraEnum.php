<?php

namespace App\Enums;

enum EstadoOrdenCompraEnum: string
{
    case PENDIENTE = 'PENDIENTE';
    case RECIBIDA_PARCIAL = 'RECIBIDA_PARCIAL';
    case RECIBIDA_COMPLETA = 'RECIBIDA_COMPLETA';
    case ANULADA = 'ANULADA';
}
