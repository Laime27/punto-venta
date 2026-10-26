<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmpresaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre'         => ['required', 'string', 'max:255'],
            'ruc'            => ['nullable', 'digits:11'],
            'telefono'       => ['nullable', 'string', 'max:20'],
            'email'          => ['nullable', 'email', 'max:255'],
            'direccion'      => ['nullable', 'string', 'max:500'],
            'moneda_simbolo' => ['required', 'string', 'max:5'],
            'timezone'       => ['nullable', 'timezone'],
            'logo'           => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'quitar_logo'    => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required'         => 'El nombre de la empresa es obligatorio.',
            'ruc.digits'              => 'El RUC debe tener 11 dígitos.',
            'moneda_simbolo.required' => 'El símbolo de moneda es obligatorio.',
            'timezone.timezone'       => 'La zona horaria no es válida.',
            'logo.image'              => 'El archivo debe ser una imagen.',
            'logo.max'                => 'El logo no debe superar los 2MB.',
        ];
    }
}
