<?php

namespace App\Services\Reporte;

use App\Enums\ReporteEnum;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReporteDatosService
{
    public function __construct(
        protected ReporteVentasService $reporteVentasService,
        protected ReporteCobranzaService $reporteCobranzaService,
        protected ReporteInventarioService $reporteInventarioService
    ) {}

    public function resumen(ReporteEnum $reporte, array $filtros): array
    {
        return match ($reporte) {
            ReporteEnum::VENTAS => $this->reporteVentasService->resumen($filtros),
            ReporteEnum::PRODUCTOS => $this->reporteVentasService->rentabilidad($filtros),
            ReporteEnum::CUENTAS_POR_COBRAR => $this->reporteCobranzaService->resumen($filtros),
            ReporteEnum::INVENTARIO => $this->reporteInventarioService->inventario($filtros),
            ReporteEnum::PERDIDAS => $this->reporteInventarioService->perdidas($filtros),
        };
    }

    public function detallePaginado(ReporteEnum $reporte, array $filtros): LengthAwarePaginator
    {
        return match ($reporte) {
            ReporteEnum::VENTAS, ReporteEnum::PRODUCTOS => $this->reporteVentasService->productosPaginados($filtros),
            ReporteEnum::CUENTAS_POR_COBRAR => $this->reporteCobranzaService->clientesPaginados($filtros),
            ReporteEnum::INVENTARIO => $this->reporteInventarioService->productosPaginados($filtros),
            ReporteEnum::PERDIDAS => $this->reporteInventarioService->perdidasPaginadas($filtros),
        };
    }

    public function detalleCompleto(ReporteEnum $reporte, array $filtros): Collection
    {
        return match ($reporte) {
            ReporteEnum::VENTAS, ReporteEnum::PRODUCTOS => $this->reporteVentasService->productos($filtros),
            ReporteEnum::CUENTAS_POR_COBRAR => $this->reporteCobranzaService->clientes($filtros),
            ReporteEnum::INVENTARIO => $this->reporteInventarioService->productos($filtros),
            ReporteEnum::PERDIDAS => $this->reporteInventarioService->perdidasPorProducto($filtros),
        };
    }
}
