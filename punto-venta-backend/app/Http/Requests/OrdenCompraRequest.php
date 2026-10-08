<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\EstadoOrdenCompraEnum;
use Illuminate\Validation\Rules\Enum;

class OrdenCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'proveedor_id' => 'nullable|exists:proveedores,id',
            'serie_id' => 'nullable|exists:tipos_comprobantes,id',
            'serie' => 'nullable|string|max:10',
            'correlativo' => 'nullable|string|max:10',
            'fecha_emision' => 'nullable|date',
            'fecha_recepcion' => 'nullable|date',
            'estado' => ['nullable', new Enum(EstadoOrdenCompraEnum::class)],
            'observaciones' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos,id',
            'detalles.*.cantidad_pedida' => 'required|numeric|min:0.01',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
        ];
    }
}
