<?php

namespace App\Enums;

enum EstadoComprobanteCreditoEnum: string
{
    case PENDIENTE = 'pendiente';
    case PAGADO = 'pagado';
    case ANULADO = 'anulado';
}
