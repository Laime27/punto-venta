<?php

namespace App\Services\Caja;

use App\Enums\EstadoCajaEnum;
use App\Enums\EstadoComprobanteEnum;
use App\Enums\FormaPagoEnum;
use App\Enums\TipoMovimientoCajaEnum;
use App\Enums\TipoMetodoPagoEnum;
use App\Exceptions\BusinessException;
use App\Models\Caja;
use App\Models\Comprobante;
use App\Models\ComprobantePago;
use App\Models\MovimientoCaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CajaService
{
    public function listar(Request $request)
    {
        $porPagina = (int) $request->query('per_page', 15);

        return Caja::with(['abiertoPor:id,name', 'cerradoPor:id,name'])
            ->when($request->query('estado'), fn($q, $estado) => $q->where('estado', $estado))
            ->when($request->query('user_id'), fn($q, $userId) => $q->where('abierto_por', $userId))
            ->when($request->query('fecha_inicio'), fn($q, $fecha) => $q->whereDate('fecha_apertura', '>=', $fecha))
            ->when($request->query('fecha_fin'), fn($q, $fecha) => $q->whereDate('fecha_apertura', '<=', $fecha))
            ->latest('id')
            ->paginate($porPagina);
    }

    public function mostrar(int $cajaId): array
    {
        $caja = Caja::with([
            'abiertoPor:id,name',
            'cerradoPor:id,name',
            'movimientos.user:id,name',
            'comprobantes.tipoComprobante',
            'comprobantes.cliente',
            'comprobantes.pagos.metodoPago',
        ])->findOrFail($cajaId);

        return [
            'caja' => $caja,
            'resumen' => $this->obtenerResumen($cajaId),
        ];
    }

    public function obtenerCajaActiva(): ?Caja
    {
        return Caja::with(['abiertoPor:id,name'])
            ->where('estado', EstadoCajaEnum::ABIERTA->value)
            ->latest('id')
            ->first();
    }

    public function abrir(array $datos): Caja
    {
        $cajaExistente = $this->obtenerCajaActiva();

        if ($cajaExistente) {
            throw new BusinessException("Ya existe una caja abierta en el sistema.");
        }

        return Caja::create([
            'abierto_por' => Auth::id(),
            'fecha_apertura' => now(),
            'monto_apertura' => $datos['monto_apertura'],
            'estado' => EstadoCajaEnum::ABIERTA->value,
            'observaciones' => $datos['observaciones'] ?? null,
        ])->load('abiertoPor:id,name');
    }

    public function cerrar(int $cajaId, array $datos): array
    {
        return DB::transaction(function () use ($cajaId, $datos) {
            $caja = Caja::findOrFail($cajaId);

            if ($caja->estado !== EstadoCajaEnum::ABIERTA->value) {
                throw new BusinessException("La caja ya no se encuentra abierta.");
            }

            $resumen = $this->obtenerResumen($cajaId);
            $saldoTeorico = $resumen['saldo_teorico'];
            $montoReal = round((float) $datos['monto_real'], 2);
            $diferencia = round($montoReal - $saldoTeorico, 2);

            $caja->update([
                'cerrado_por' => Auth::id(),
                'fecha_cierre' => now(),
                'saldo_teorico' => $saldoTeorico,
                'monto_real' => $montoReal,
                'diferencia' => $diferencia,
                'estado' => EstadoCajaEnum::CERRADA->value,
                'observaciones' => $datos['observaciones'] ?? $caja->observaciones,
            ]);

            return [
                'caja' => $caja->fresh(['abiertoPor:id,name', 'cerradoPor:id,name']),
                'resumen' => $this->obtenerResumen($caja->id),
            ];
        });
    }

    public function obtenerResumen(int $cajaId): array
    {
        $caja = Caja::findOrFail($cajaId);

        $comprobantes = Comprobante::where('caja_id', $cajaId)
            ->where('estado', '!=', EstadoComprobanteEnum::ANULADO->value)
            ->get();

        $movimientos = MovimientoCaja::where('caja_id', $cajaId)->get();

        $montoApertura = (float) $caja->monto_apertura;

        // Pagos que entraron en esta caja (ventas del turno + abonos de créditos anteriores)
        $todosLosPagos = ComprobantePago::with(['metodoPago', 'comprobante:id,caja_id,estado'])
            ->where('caja_id', $cajaId)
            ->whereHas('comprobante', fn($q) => $q->where('estado', '!=', EstadoComprobanteEnum::ANULADO->value))
            ->get();

        // Lo que realmente quedó en caja: lo digitado menos el vuelto entregado
        $todosLosPagos->each(fn($pago) => $pago->monto_neto = round((float) $pago->monto - (float) $pago->monto_devuelto, 2));

        $cobrosCredito = round((float) $todosLosPagos
            ->filter(fn($pago) => (int) $pago->comprobante->caja_id !== $cajaId)
            ->sum('monto_neto'), 2);

        $vueltoEntregado = round((float) $todosLosPagos->sum('monto_devuelto'), 2);

        $ventasEfectivo = round((float) $todosLosPagos
            ->filter(fn($pago) => $pago->metodoPago && $pago->metodoPago->tipo === TipoMetodoPagoEnum::EFECTIVO->value)
            ->sum('monto_neto'), 2);

        $ventasTarjeta = round((float) $todosLosPagos
            ->filter(fn($pago) => $pago->metodoPago && $pago->metodoPago->tipo === TipoMetodoPagoEnum::TARJETA->value)
            ->sum('monto_neto'), 2);

        $ventasTransferencia = round((float) $todosLosPagos
            ->filter(fn($pago) => $pago->metodoPago && $pago->metodoPago->tipo === TipoMetodoPagoEnum::TRANSFERENCIA->value)
            ->sum('monto_neto'), 2);

        $desgloseMetodos = $todosLosPagos
            ->groupBy('metodo_pago_id')
            ->map(function ($pagos) {
                $primerPago = $pagos->first();
                return [
                    'metodo_pago_id' => $primerPago->metodo_pago_id,
                    'nombre' => $primerPago->metodoPago?->nombre ?? 'Desconocido',
                    'tipo' => $primerPago->metodoPago?->tipo ?? 'otro',
                    'total' => round((float) $pagos->sum('monto_neto'), 2),
                ];
            })
            ->values();

        $totalIngresos = round((float) $movimientos
            ->where('tipo', TipoMovimientoCajaEnum::INGRESO->value)
            ->sum('monto'), 2);

        $totalEgresos = round((float) $movimientos
            ->where('tipo', TipoMovimientoCajaEnum::EGRESO->value)
            ->sum('monto'), 2);

        $saldoTeorico = round($montoApertura + $ventasEfectivo + $totalIngresos - $totalEgresos, 2);

        return [
            'caja_id' => $caja->id,
            'estado' => $caja->estado,
            'fecha_apertura' => $caja->fecha_apertura,
            'fecha_cierre' => $caja->fecha_cierre,
            'monto_apertura' => $montoApertura,
            'ventas' => [
                'total' => round((float) $comprobantes->sum('total'), 2),
                'cantidad_comprobantes' => $comprobantes->count(),
                'contado' => round((float) $comprobantes->where('forma_pago', FormaPagoEnum::CONTADO->value)->sum('total'), 2),
                'credito' => round((float) $comprobantes->where('forma_pago', FormaPagoEnum::CREDITO->value)->sum('total'), 2),
                'efectivo' => $ventasEfectivo,
                'tarjeta' => $ventasTarjeta,
                'transferencia' => $ventasTransferencia,
                'desglose_metodos' => $desgloseMetodos,
            ],
            'cobros_credito' => $cobrosCredito,
            'vuelto_entregado' => $vueltoEntregado,
            'movimientos' => [
                'total_ingresos' => $totalIngresos,
                'total_egresos' => $totalEgresos,
                'cantidad_ingresos' => $movimientos->where('tipo', TipoMovimientoCajaEnum::INGRESO->value)->count(),
                'cantidad_egresos' => $movimientos->where('tipo', TipoMovimientoCajaEnum::EGRESO->value)->count(),
            ],
            'saldo_teorico' => $saldoTeorico,
            'monto_real' => (float) $caja->monto_real,
            'diferencia' => (float) $caja->diferencia,
        ];
    }
}
