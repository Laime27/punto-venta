<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImpresoraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'ancho'  => ['required', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'Debe seleccionar una impresora.',
            'ancho.required'  => 'El ancho del papel es obligatorio.',
        ];
    }
}
