<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MetodoPagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'max:255',
                Rule::unique('metodos_pagos', 'nombre')->whereNull('deleted_at')->ignore($this->metodo_pago),
            ],
            'tipo' => [
                'required',
                Rule::in(['efectivo', 'tarjeta', 'transferencia']),
            ],
        ];
    }
}
