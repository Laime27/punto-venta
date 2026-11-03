<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productoId = $this->route('producto');

        return [
            'nombre'           => ['required', 'string', 'max:255','unique:productos,nombre,'.$productoId],
            'descripcion'      => ['nullable', 'string', 'max:255'],
            'precio_compra'    => ['nullable', 'numeric', 'min:0'],
            'precio_venta'     => ['required', 'numeric', 'min:0'],
            'precio_mayoreo'   => ['nullable', 'numeric', 'min:0'],
            'stock'            => ['nullable', 'numeric', 'min:0'],
            'stock_minimo'     => ['nullable', 'numeric', 'min:0'],
            'codigo_barras'    => ['nullable', 'string', 'max:100', 'unique:productos,codigo_barras,'.$productoId],

            'imagen'           => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'categoria_id'     => ['nullable', 'exists:categorias,id'],
            'unidad_id'        => ['nullable', 'exists:unidades,id'],
            'disponible_venta' => ['nullable', 'boolean'],
            'proveedores'      => ['nullable', 'array'],
            'proveedores.*'    => ['integer', 'exists:proveedores,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required'        => 'El nombre del producto es obligatorio.',
            'nombre.unique'          => 'Ya existe un producto con ese nombre.',
            'codigo_barras.unique'   => 'Ya existe un producto con ese código de barras.',
            'precio_venta.required'  => 'El precio de venta es obligatorio.',
            'imagen.image'           => 'El archivo debe ser una imagen.',
            'imagen.max'             => 'La imagen no debe superar los 2MB.',
        ];
    }
}
