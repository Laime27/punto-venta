<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:60', Rule::unique('roles', 'name')->ignore($this->route('rol'))],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'permisos' => ['required', 'array', 'min:1'],
            'permisos.*' => ['integer', 'distinct', 'exists:permissions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del rol es obligatorio.',
            'name.unique' => 'Ya existe un rol con ese nombre.',
            'permisos.required' => 'Selecciona al menos un permiso.',
            'permisos.min' => 'Selecciona al menos un permiso.',
        ];
    }
}
