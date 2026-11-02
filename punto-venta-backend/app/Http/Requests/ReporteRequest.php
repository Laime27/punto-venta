<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReporteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin' => ['nullable', 'date', 'after_or_equal:fecha_inicio'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'categoria_id' => ['nullable', 'integer', 'exists:categorias,id'],
            'producto_id' => ['nullable', 'integer', 'exists:productos,id'],
            'cliente_id' => ['nullable', 'integer', 'exists:clientes,id'],
            'solo_stock_bajo' => ['nullable', 'boolean'],
            'formato' => ['nullable', 'in:excel,pdf'],
            'per_page' => ['nullable', 'integer', 'in:10,15,20,50'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha_fin.after_or_equal' => 'La fecha final debe ser igual o posterior a la fecha inicial.',
        ];
    }

    public function filtros(): array
    {
        return [
            ...$this->validated(),
            'fecha_inicio' => $this->validated('fecha_inicio') ?? now()->startOfMonth()->toDateString(),
            'fecha_fin' => $this->validated('fecha_fin') ?? now()->toDateString(),
            'solo_stock_bajo' => $this->boolean('solo_stock_bajo'),
            'formato' => $this->validated('formato') ?? 'excel',
            'per_page' => (int) ($this->validated('per_page') ?? 10),
        ];
    }
}
