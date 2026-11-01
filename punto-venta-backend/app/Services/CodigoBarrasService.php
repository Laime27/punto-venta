<?php

namespace App\Services;

use App\Models\Producto;


class CodigoBarrasService
{
    private const PREFIJO = '20';

    public function generar(?int $semilla = null): string
    {
        $numero = $semilla ?? ((int) Producto::withTrashed()->max('id') + 1);

        do {
            $codigo = $this->construirEan13($numero);
            $numero++;
        } while (Producto::withTrashed()->where('codigo_barras', $codigo)->exists());

        return $codigo;
    }

    private function construirEan13(int $numero): string
    {
        $base = self::PREFIJO . str_pad((string) $numero, 10, '0', STR_PAD_LEFT);

        return $base . $this->digitoVerificador($base);
    }

    private function digitoVerificador(string $base): int
    {
        $suma = 0;
        foreach (str_split($base) as $posicion => $digito) {
            $suma += (int) $digito * ($posicion % 2 === 0 ? 1 : 3);
        }

        return (10 - $suma % 10) % 10;
    }
}
