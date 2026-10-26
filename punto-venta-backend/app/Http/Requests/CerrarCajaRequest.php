<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CerrarCajaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'monto_real' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ];
    }
}
