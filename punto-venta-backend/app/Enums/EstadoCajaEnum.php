<?php

namespace App\Enums;

enum EstadoCajaEnum: string
{
    case ABIERTA = 'abierta';
    case CERRADA = 'cerrada';
    case ANULADA = 'anulada';
}
