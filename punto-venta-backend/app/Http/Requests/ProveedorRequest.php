<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProveedorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('proveedor');
        return [
            'nombre'    => ['required', 'string', 'max:255'],
            'correo'    => ['nullable', 'email', 'max:255', 'unique:proveedores,correo,' . $id],
            'telefono'  => ['nullable', 'string', 'max:255'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'nota'      => ['nullable', 'string', 'max:255'],
        ];
    }
}
