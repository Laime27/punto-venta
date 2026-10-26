<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ComprobanteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo_unico' => 'nullable|string',
            'cliente_id' => 'nullable|exists:clientes,id',
            'cotizacion_id' => 'nullable|exists:cotizaciones,id',
            'carrito' => 'required|array|min:1',
            'carrito.*.producto_id' => 'required|exists:productos,id',
            'carrito.*.cantidad' => 'required|numeric|min:0.01',
            'carrito.*.precio' => 'required|numeric|min:0',
            'carrito.*.subtotal' => 'required|numeric|min:0',
            'tipoVenta' => 'required|string',
            'pagos' => 'nullable|array',
            'pagos.*.metodo_pago_id' => 'required_with:pagos|exists:metodos_pagos,id',
            'pagos.*.monto' => 'required_with:pagos|numeric|min:0.01',
            'cuotas' => 'nullable|array',
            'cuotas.*.fecha' => 'required_with:cuotas|date',
            'cuotas.*.monto' => 'required_with:cuotas|numeric|min:0.01',
            'totales' => 'required|array',
            'totales.subtotal' => 'required|numeric|min:0',
            'totales.descuento' => 'required|numeric|min:0',
            'totales.total' => 'required|numeric|min:0',
        ];
    }
}
