<?php

namespace App\Services\Reporte;

use App\Enums\EstadoComprobanteEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReporteCobranzaService
{
    private const LIMITE_TOP = 10;

    public function resumen(array $filtros): array
    {
        $hoy = now()->toDateString();

        $totales = $this->cuotasPendientes($filtros)
            ->selectRaw('
                COALESCE(SUM(comprobante_creditos.saldo_pendiente), 0) as total,
                COALESCE(SUM(CASE WHEN comprobante_creditos.fecha < ? THEN comprobante_creditos.saldo_pendiente ELSE 0 END), 0) as vencido,
                COUNT(DISTINCT comprobantes.cliente_id) as clientes,
                COUNT(DISTINCT CASE WHEN comprobante_creditos.fecha < ? THEN comprobantes.cliente_id END) as clientes_vencidos
            ', [$hoy, $hoy])
            ->first();

        return [
            'indicadores' => [
                'total_por_cobrar' => round((float) $totales->total, 2),
                'total_vencido' => round((float) $totales->vencido, 2),
                'total_por_vencer' => round((float) $totales->total - (float) $totales->vencido, 2),
                'clientes_con_deuda' => (int) $totales->clientes,
                'clientes_con_vencidos' => (int) $totales->clientes_vencidos,
            ],
            'mayores_deudores' => $this->consultaClientes($filtros)->limit(self::LIMITE_TOP)->get()->map(fn($fila) => $this->mapearCliente($fila)),
        ];
    }

    public function clientesPaginados(array $filtros): LengthAwarePaginator
    {
        return $this->consultaClientes($filtros)
            ->paginate($filtros['per_page'])
            ->through(fn($fila) => $this->mapearCliente($fila));
    }

    public function clientes(array $filtros): Collection
    {
        return $this->consultaClientes($filtros)->get()->map(fn($fila) => $this->mapearCliente($fila));
    }

    private function consultaClientes(array $filtros): Builder
    {
        return $this->cuotasPendientes($filtros)
            ->join('clientes', 'clientes.id', '=', 'comprobantes.cliente_id')
            ->groupBy('clientes.id', 'clientes.nombre', 'clientes.telefono')
            ->selectRaw('
                clientes.id,
                clientes.nombre as cliente,
                clientes.telefono,
                COUNT(DISTINCT comprobantes.id) as ventas,
                COUNT(*) as cuotas_pendientes,
                SUM(comprobante_creditos.saldo_pendiente) as saldo,
                SUM(CASE WHEN comprobante_creditos.fecha < ? THEN comprobante_creditos.saldo_pendiente ELSE 0 END) as saldo_vencido,
                MIN(comprobante_creditos.fecha) as vencimiento_mas_antiguo
            ', [now()->toDateString()])
            ->orderByDesc('saldo');
    }

    private function cuotasPendientes(array $filtros): Builder
    {
        return DB::table('comprobante_creditos')
            ->join('comprobantes', 'comprobantes.id', '=', 'comprobante_creditos.comprobante_id')
            ->whereNull('comprobantes.deleted_at')
            ->where('comprobantes.estado', '!=', EstadoComprobanteEnum::ANULADO->value)
            ->where('comprobante_creditos.saldo_pendiente', '>', 0)
            ->when($filtros['cliente_id'] ?? null, fn($query, $clienteId) => $query->where('comprobantes.cliente_id', $clienteId));
    }

    private function mapearCliente(object $fila): array
    {
        return [
            'id' => $fila->id,
            'cliente' => $fila->cliente,
            'telefono' => $fila->telefono,
            'ventas' => (int) $fila->ventas,
            'cuotas_pendientes' => (int) $fila->cuotas_pendientes,
            'saldo' => round((float) $fila->saldo, 2),
            'saldo_vencido' => round((float) $fila->saldo_vencido, 2),
            'saldo_por_vencer' => round((float) $fila->saldo - (float) $fila->saldo_vencido, 2),
            'vencimiento_mas_antiguo' => $fila->vencimiento_mas_antiguo,
        ];
    }
}
