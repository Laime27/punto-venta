<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PlantillaExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        return [
            [
                'Coca Cola 600ml',
                'Refresco de cola',
                12.50,
                15.00,
                14.00,
                100,
                20,
                '7501055300075',
                'Bebidas',
                'Unidad',
                1
            ],
            [
                'Tomate',
                'Tomate fresco a granel',
                2.50,
                4.00,
                3.50,
                50,
                5,
                '200000000001',
                'Verduras',
                'Kilogramo',
                1
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'nombre',
            'descripcion',
            'precio_compra',
            'precio_venta',
            'precio_mayoreo',
            'stock',
            'stock_minimo',
            'codigo_barras',
            'categoria',
            'unidad',
            'disponible_venta'
        ];
    }
}
