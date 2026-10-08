<?php

namespace App\Enums;

enum EstadoComprobanteEnum: string
{
    case PAGADO = 'pagado';
    case PENDIENTE = 'pendiente';
    case ANULADO = 'anulado';
}
