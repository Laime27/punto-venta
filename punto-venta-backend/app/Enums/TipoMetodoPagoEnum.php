<?php

namespace App\Enums;

enum TipoMetodoPagoEnum: string
{
    case EFECTIVO = 'efectivo';
    case TARJETA = 'tarjeta';
    case TRANSFERENCIA = 'transferencia';
}
