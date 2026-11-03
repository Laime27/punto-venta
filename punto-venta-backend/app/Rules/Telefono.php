<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Telefono implements ValidationRule
{
    private const FORMATO = '/^\+?[0-9][0-9\s-]{5,19}$/';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!preg_match(self::FORMATO, (string) $value)) {
            $fail('El teléfono solo puede tener números, espacios, guiones y un + inicial (mínimo 6 dígitos).');
        }
    }
}
