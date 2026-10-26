<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnularComprobanteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'motivo_anulacion' => 'required|string|min:3|max:500'
        ];
    }
}
