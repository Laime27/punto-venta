<?php

namespace App\Services\Caja;

use App\Enums\EstadoCajaEnum;
use App\Enums\TipoMovimientoCajaEnum;
use App\Exceptions\BusinessException;
use App\Models\Caja;
use App\Models\MovimientoCaja;
use App\Services\EmpresaService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MovimientoCajaService
{
    public function __construct(
        protected CajaService $cajaService,
        protected EmpresaService $empresaService
    ) {}

    public function registrar(array $datos): MovimientoCaja
    {
        return DB::transaction(function () use ($datos) {
            $caja = $this->obtenerCajaAbierta($datos['caja_id'] ?? null);

            if ($datos['tipo'] === TipoMovimientoCajaEnum::EGRESO->value) {
                $this->validarEfectivoDisponible($caja, (float) $datos['monto']);
            }

            return MovimientoCaja::create([
                'caja_id' => $caja->id,
                'user_id' => Auth::id(),
                'tipo' => $datos['tipo'],
                'monto' => $datos['monto'],
                'motivo' => $datos['motivo'],
                'observaciones' => $datos['observaciones'] ?? null,
            ]);
        });
    }

    private function obtenerCajaAbierta(?int $cajaId): Caja
    {
        $caja = Caja::when($cajaId, fn ($query) => $query->whereKey($cajaId))
            ->when(!$cajaId, fn ($query) => $query->where('estado', EstadoCajaEnum::ABIERTA->value)->latest('id'))
            ->lockForUpdate()
            ->first();

        if (!$caja || $caja->estado !== EstadoCajaEnum::ABIERTA->value) {
            throw new BusinessException("No se pueden registrar movimientos en una caja cerrada o inexistente.");
        }

        return $caja;
    }

    private function validarEfectivoDisponible(Caja $caja, float $monto): void
    {
        $disponible = (float) $this->cajaService->obtenerResumen($caja->id)['saldo_teorico'];

        if ($monto > $disponible) {
            $simbolo = $this->empresaService->obtener()->moneda_simbolo;
            throw new BusinessException("El egreso supera el efectivo disponible en caja ({$simbolo} " . number_format($disponible, 2) . ').');
        }
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
