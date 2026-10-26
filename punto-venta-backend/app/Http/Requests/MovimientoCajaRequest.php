<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MovimientoCajaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'caja_id' => 'nullable|exists:cajas,id',
            'tipo' => 'required|in:ingreso,egreso',
            'monto' => 'required|numeric|min:0.01',
            'motivo' => 'required|string|max:255',
            'observaciones' => 'nullable|string|max:500',
        ];
    }
}
