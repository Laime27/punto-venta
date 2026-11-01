<?php

namespace App\Http\Requests;

use App\Enums\TipoMovimientoEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AjusteInventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_movimiento_id' => ['required', 'integer', Rule::in([
                TipoMovimientoEnum::RECUENTO_INVENTARIO->value,
                TipoMovimientoEnum::PERDIDA->value,
                TipoMovimientoEnum::DANO->value,
            ])],
            'motivo' => ['nullable', 'string', 'max:500'],
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.producto_id' => ['required', 'integer', 'distinct', 'exists:productos,id'],
            'detalles.*.cantidad' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_movimiento_id.required' => 'El tipo de ajuste es obligatorio.',
            'tipo_movimiento_id.in' => 'El tipo de ajuste debe ser recuento, pérdida o daño.',
            'detalles.required' => 'Debe agregar al menos un producto.',
            'detalles.min' => 'Debe agregar al menos un producto.',
            'detalles.*.producto_id.distinct' => 'Un producto no puede repetirse en el mismo ajuste.',
            'detalles.*.producto_id.exists' => 'El producto seleccionado no existe.',
            'detalles.*.cantidad.required' => 'La cantidad es obligatoria.',
            'detalles.*.cantidad.min' => 'La cantidad no puede ser negativa.',
        ];
    }
}
