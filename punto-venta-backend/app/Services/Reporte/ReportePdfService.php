<?php

namespace App\Services\Reporte;

use App\Enums\ReporteEnum;
use App\Services\EmpresaService;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DocumentoPdf;
use Illuminate\Support\Carbon;

class ReportePdfService
{
    public function __construct(
        protected ReporteDatosService $reporteDatosService,
        protected ReporteVentasService $reporteVentasService,
        protected EmpresaService $empresaService
    ) {}

    public function generar(ReporteEnum $reporte, array $filtros): DocumentoPdf
    {
        $empresa = $this->empresaService->obtener();

        return Pdf::loadView("pdf.reportes.{$reporte->value}", [
            'datos' => $this->reporteDatosService->resumen($reporte, $filtros),
            'detalle' => $this->reporteDatosService->detalleCompleto($reporte, $filtros),
            'titulo' => $reporte->titulo(),
            'periodo' => $this->describirPeriodo($reporte, $filtros),
            'vendedor' => $this->reporteVentasService->nombreVendedor($filtros['user_id'] ?? null),
            'empresa' => $empresa,
            'simbolo' => $empresa->moneda_simbolo,
            'generado' => now()->format('d/m/Y H:i'),
        ])->setPaper('a4')->setOption('isFontSubsettingEnabled', true);
    }

    private function describirPeriodo(ReporteEnum $reporte, array $filtros): string
    {
        if (!$reporte->usaRangoFechas()) {
            return 'Al ' . now()->format('d/m/Y');
        }

        $inicio = Carbon::parse($filtros['fecha_inicio'])->format('d/m/Y');
        $fin = Carbon::parse($filtros['fecha_fin'])->format('d/m/Y');

        return $inicio === $fin ? $inicio : "Del {$inicio} al {$fin}";
    }
}
