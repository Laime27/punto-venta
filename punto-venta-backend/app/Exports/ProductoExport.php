<?php

namespace App\Exports;

use App\Models\Producto;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductoExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Producto::all();
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

    public function map($producto): array
    {
        return [
            $producto->nombre,
            $producto->descripcion,
            $producto->precio_compra,
            $producto->precio_venta,
            $producto->precio_mayoreo,
            $producto->stock,
            $producto->stock_minimo,
            $producto->codigo_barras,
            $producto->categoria ? $producto->categoria->nombre : null,
            $producto->unidad ? $producto->unidad->nombre : null,
            $producto->disponible_venta ? 1 : 0,
        ];
    }
}
