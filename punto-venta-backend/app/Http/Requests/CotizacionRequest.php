<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CotizacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cliente_id' => 'nullable|exists:clientes,id',
            'fecha_emision' => 'nullable|date',
            'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_emision',
            'estado' => 'nullable|in:PENDIENTE,ACEPTADA,RECHAZADA,VENCIDA',
            'observaciones' => 'nullable|string',
            'descuento' => 'nullable|numeric|min:0',
            'porcentaje_impuesto' => 'nullable|numeric|min:0',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos,id',
            'detalles.*.cantidad' => 'required|numeric|min:0.01',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.descuento_unitario' => 'nullable|numeric|min:0',
        ];
    }
}
