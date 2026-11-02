<?php

namespace App\Enums;

enum ReporteEnum: string
{
    case VENTAS = 'ventas';
    case PRODUCTOS = 'productos';
    case CUENTAS_POR_COBRAR = 'cuentas-por-cobrar';
    case INVENTARIO = 'inventario';
    case PERDIDAS = 'perdidas';

    public function titulo(): string
    {
        return match ($this) {
            self::VENTAS => 'Reporte de ventas',
            self::PRODUCTOS => 'Rentabilidad de productos',
            self::CUENTAS_POR_COBRAR => 'Cuentas por cobrar',
            self::INVENTARIO => 'Inventario valorizado',
            self::PERDIDAS => 'Pérdidas de inventario',
        };
    }

    public function permiso(): string
    {
        return 'reporte.' . str_replace('-', '_', $this->value);
    }

    public function usaRangoFechas(): bool
    {
        return !in_array($this, [self::CUENTAS_POR_COBRAR, self::INVENTARIO]);
    }

    public static function valores(): array
    {
        return array_column(self::cases(), 'value');
    }
}
