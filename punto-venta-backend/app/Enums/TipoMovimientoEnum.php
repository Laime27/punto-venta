<?php

namespace App\Enums;

enum TipoMovimientoEnum: int
{
    case RECIBIR_ARTICULOS = 1;
    case RECUENTO_INVENTARIO = 2;
    case PERDIDA = 3;
    case DANO = 4;
    case ARTICULO_EDITADO = 5;
    case IMPORTACION = 6;
    case VENTA = 7;
    case COMPRA = 8;
    case DEVOLUCION = 9;
    case ANULACION_VENTA = 10;
    case ARTICULO_CREADO = 11;
}
