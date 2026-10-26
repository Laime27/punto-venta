<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbrirCajaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'monto_apertura' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ];
    }
}
