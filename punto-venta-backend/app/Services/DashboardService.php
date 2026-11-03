<?php

namespace App\Services;

use App\Enums\EstadoComprobanteEnum;
use App\Models\Comprobante;
use App\Services\Caja\CajaService;
use App\Services\Reporte\ReporteCobranzaService;
use App\Services\Reporte\ReporteInventarioService;
use App\Services\Reporte\ReporteVentasService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class DashboardService
{
    private const DIAS_EVOLUCION = 7;
    private const LIMITE_LISTAS = 5;

    public function __construct(
        protected ReporteVentasService $reporteVentasService,
        protected ReporteCobranzaService $reporteCobranzaService,
        protected ReporteInventarioService $reporteInventarioService,
        protected CajaService $cajaService
    ) {}

    public function obtener(): array
    {
        $hoy = now()->toDateString();
        $resumenMes = $this->reporteVentasService->resumen($this->rango(now()->startOfMonth()->toDateString(), $hoy));
        $cobranza = $this->reporteCobranzaService->resumen([])['indicadores'];
        $inventario = $this->reporteInventarioService->inventario(['solo_stock_bajo' => false])['indicadores'];

        return [
            'hoy' => $this->reporteVentasService->indicadoresVentas($this->rango($hoy, $hoy)),
            'ayer' => $this->reporteVentasService->indicadoresVentas($this->rango(now()->subDay()->toDateString(), now()->subDay()->toDateString())),
            'mes' => $resumenMes['indicadores'],
            'por_cobrar' => [
                'total' => $cobranza['total_por_cobrar'],
                'vencido' => $cobranza['total_vencido'],
                'clientes_con_vencidos' => $cobranza['clientes_con_vencidos'],
            ],
            'inventario' => [
                'valor_costo' => $inventario['valor_costo'],
                'stock_bajo' => $inventario['productos_stock_bajo'],
                'por_agotarse' => $inventario['productos_por_agotarse'],
            ],
            'caja' => $this->cajaActual(),
            'evolucion' => $this->evolucion(),
            'metodos_pago' => $resumenMes['metodos_pago'],
            'mas_vendidos' => $resumenMes['mas_vendidos']->take(self::LIMITE_LISTAS)->values(),
            'stock_bajo' => $this->reporteInventarioService->productosConStockBajo(self::LIMITE_LISTAS),
            'ultimas_ventas' => $this->ultimasVentas(),
        ];
    }

    private function rango(string $inicio, string $fin): array
    {
        return ['fecha_inicio' => $inicio, 'fecha_fin' => $fin];
    }

    private function cajaActual(): array
    {
        $caja = $this->cajaService->obtenerCajaActiva();

        if (!$caja) {
            return ['abierta' => false];
        }

        return [
            'abierta' => true,
            'id' => $caja->id,
            'abierto_por' => $caja->abiertoPor?->name,
            'fecha_apertura' => $caja->fecha_apertura,
            'saldo_teorico' => $this->cajaService->obtenerResumen($caja->id)['saldo_teorico'],
        ];
    }

    private function evolucion(): Collection
    {
        $inicio = now()->subDays(self::DIAS_EVOLUCION - 1)->startOfDay();
        $ventas = $this->reporteVentasService
            ->ventasPorPeriodo($this->rango($inicio->toDateString(), now()->toDateString()))
            ->keyBy('periodo');

        return collect(range(0, self::DIAS_EVOLUCION - 1))->map(function (int $dias) use ($inicio, $ventas) {
            $fecha = Carbon::parse($inicio)->addDays($dias)->toDateString();

            return [
                'fecha' => $fecha,
                'total' => $ventas->get($fecha)['total'] ?? 0,
                'cantidad' => $ventas->get($fecha)['cantidad'] ?? 0,
            ];
        });
    }

    private function ultimasVentas(): Collection
    {
        return Comprobante::with('cliente:id,nombre')
            ->where('estado', '!=', EstadoComprobanteEnum::ANULADO->value)
            ->latest('id')
            ->limit(self::LIMITE_LISTAS)
            ->get(['id', 'serie', 'correlativo', 'cliente_id', 'total', 'forma_pago', 'fecha_emision'])
            ->map(fn (Comprobante $venta) => [
                'id' => $venta->id,
                'documento' => "{$venta->serie}-{$venta->correlativo}",
                'cliente' => $venta->cliente?->nombre,
                'total' => (float) $venta->total,
                'forma_pago' => $venta->forma_pago,
                'fecha' => (string) $venta->fecha_emision,
            ]);
    }
}
