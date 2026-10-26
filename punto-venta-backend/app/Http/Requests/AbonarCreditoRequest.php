<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AbonarCreditoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pagos' => 'required_without:monto|array|min:1',
            'pagos.*.metodo_pago_id' => 'required_with:pagos|exists:metodos_pagos,id',
            'pagos.*.monto' => 'required_with:pagos|numeric|min:0.01',
            'monto' => 'required_without:pagos|numeric|min:0.01',
            'metodo_pago_id' => 'required_without:pagos|exists:metodos_pagos,id',
        ];
    }
}
