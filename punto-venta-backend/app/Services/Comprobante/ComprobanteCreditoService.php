<?php

namespace App\Services\Comprobante;

use App\Models\Comprobante;
use App\Models\ComprobanteCredito;
use App\Models\ComprobantePago;
use App\Enums\EstadoComprobanteEnum;
use App\Enums\EstadoComprobanteCreditoEnum;
use App\Exceptions\BusinessException;
use App\Services\Caja\CajaService;
use Illuminate\Support\Facades\DB;

class ComprobanteCreditoService
{
    public function __construct(
        protected CajaService $cajaService
    ) {}

    public function registrarAbono(int $creditoId, array $data): bool
    {
        $cajaAbierta = $this->cajaService->obtenerCajaActiva();

        if (!$cajaAbierta) {
            throw new BusinessException("Debe abrir una caja antes de registrar abonos.");
        }

        $pagos = $this->obtenerPagos($data);
        $montoTotal = round(collect($pagos)->sum('monto'), 2);

        if ($montoTotal <= 0) {
            throw new BusinessException("El monto total del abono debe ser mayor a 0.");
        }

        $comprobanteId = ComprobanteCredito::findOrFail($creditoId)->comprobante_id;

        return DB::transaction(function () use ($comprobanteId, $creditoId, $pagos, $montoTotal, $cajaAbierta) {
            $comprobante = Comprobante::lockForUpdate()->findOrFail($comprobanteId);
            $cuotas = $comprobante->creditos()->lockForUpdate()->get();
            $credito = $cuotas->firstWhere('id', $creditoId);

            $this->validarAbono($comprobante, $credito, $montoTotal);

            $nuevoSaldo = round((float) $credito->saldo_pendiente - $montoTotal, 2);

            $credito->update([
                'saldo_pendiente' => $nuevoSaldo,
                'estado' => $nuevoSaldo <= 0 ? EstadoComprobanteCreditoEnum::PAGADO->value : EstadoComprobanteCreditoEnum::PENDIENTE->value,
            ]);

            foreach ($pagos as $pago) {
                ComprobantePago::create([
                    'comprobante_id' => $comprobante->id,
                    'caja_id' => $cajaAbierta->id,
                    'metodo_pago_id' => $pago['metodo_pago_id'],
                    'monto' => $pago['monto'],
                    'referencia' => 'Abono del credito de la venta #' . $comprobante->serie . '-' . $comprobante->correlativo,
                ]);
            }

            if ($cuotas->sum('saldo_pendiente') <= 0) {
                $comprobante->update(['estado' => EstadoComprobanteEnum::PAGADO->value]);
            }

            return true;
        });
    }

    private function obtenerPagos(array $data): array
    {
        $pagos = $data['pagos'] ?? [];

        if (empty($pagos) && isset($data['monto'], $data['metodo_pago_id'])) {
            $pagos = [['metodo_pago_id' => $data['metodo_pago_id'], 'monto' => $data['monto']]];
        }

        if (empty($pagos)) {
            throw new BusinessException("Debe ingresar al menos un método de pago.");
        }

        return $pagos;
    }

    private function validarAbono(Comprobante $comprobante, ComprobanteCredito $credito, float $montoTotal): void
    {
        if ($comprobante->estado === EstadoComprobanteEnum::ANULADO->value) {
            throw new BusinessException("No se pueden registrar pagos a un comprobante anulado.");
        }

        $saldoActual = (float) $credito->saldo_pendiente;

        if ($credito->estado === EstadoComprobanteCreditoEnum::PAGADO->value || $saldoActual <= 0) {
            throw new BusinessException("Esta cuota ya se encuentra totalmente cancelada.");
        }

        if ($montoTotal > $saldoActual) {
            throw new BusinessException("El monto total ingresado ({$montoTotal}) no puede superar el saldo pendiente ({$saldoActual}).");
        }
    }
}
