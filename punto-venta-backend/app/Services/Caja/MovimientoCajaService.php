<?php

namespace App\Services\Caja;

use App\Enums\EstadoCajaEnum;
use App\Exceptions\BusinessException;
use App\Models\Caja;
use App\Models\MovimientoCaja;
use Illuminate\Support\Facades\Auth;

class MovimientoCajaService
{
    public function registrar(array $datos): MovimientoCaja
    {
        $cajaId = $datos['caja_id'] ?? null;

        if ($cajaId) {
            $caja = Caja::find($cajaId);
        } else {
            $caja = Caja::where('estado', EstadoCajaEnum::ABIERTA->value)
                ->latest('id')
                ->first();
        }

        if (!$caja || $caja->estado !== EstadoCajaEnum::ABIERTA->value) {
            throw new BusinessException("No se pueden registrar movimientos en una caja cerrada o inexistente.");
        }

        return MovimientoCaja::create([
            'caja_id' => $caja->id,
            'user_id' => Auth::id(),
            'tipo' => $datos['tipo'],
            'monto' => $datos['monto'],
            'motivo' => $datos['motivo'],
            'observaciones' => $datos['observaciones'] ?? null,
        ]);
    }

    public function listarPorCaja(int $cajaId, ?string $tipo = null)
    {
        return MovimientoCaja::with(['user:id,name'])
            ->where('caja_id', $cajaId)
            ->when($tipo, fn($q, $t) => $q->where('tipo', $t))
            ->latest('id')
            ->get();
    }
}
