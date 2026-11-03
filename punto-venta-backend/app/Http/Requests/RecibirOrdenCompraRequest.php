<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecibirOrdenCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.id' => ['required', 'integer', 'distinct'],
            'detalles.*.cantidad_recibida' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'detalles.required' => 'Debe enviar los productos a recibir.',
            'detalles.*.cantidad_recibida.required' => 'Ingresa la cantidad recibida.',
            'detalles.*.cantidad_recibida.numeric' => 'La cantidad recibida debe ser un número.',
            'detalles.*.cantidad_recibida.min' => 'La cantidad recibida no puede ser negativa.',
        ];
    }
}
