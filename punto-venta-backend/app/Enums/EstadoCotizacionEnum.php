<?php

namespace App\Enums;

enum EstadoCotizacionEnum: string
{
    case PENDIENTE = 'PENDIENTE';
    case ACEPTADA = 'ACEPTADA';
    case RECHAZADA = 'RECHAZADA';
    case VENCIDA = 'VENCIDA';
}
