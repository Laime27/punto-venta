<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportarFilasProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'filas' => ['required', 'array', 'min:1'],
            'filas.*' => ['array'],
            'filas.*.fila' => ['required', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'filas.required' => 'Debe enviar al menos un producto.',
            'filas.min' => 'Debe enviar al menos un producto.',
        ];
    }
}
