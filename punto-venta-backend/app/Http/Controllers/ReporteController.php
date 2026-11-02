<?php

namespace App\Http\Controllers;

use App\Enums\ReporteEnum;
use App\Http\Requests\ReporteRequest;
use App\Services\Reporte\ReporteDatosService;
use App\Services\Reporte\ReporteExcelService;
use App\Services\Reporte\ReportePdfService;
use App\Services\Reporte\ReporteVentasService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;

class ReporteController extends Controller
{
    public function __construct(
        protected ReporteDatosService $reporteDatosService,
        protected ReporteExcelService $reporteExcelService,
        protected ReportePdfService $reportePdfService,
        protected ReporteVentasService $reporteVentasService
    ) {}

    public function show(ReporteRequest $request, string $reporte)
    {
        $reporte = $this->autorizar($reporte);

        return response()->json($this->reporteDatosService->resumen($reporte, $request->filtros()));
    }

    public function detalle(ReporteRequest $request, string $reporte)
    {
        $reporte = $this->autorizar($reporte);

        return response()->json($this->reporteDatosService->detallePaginado($reporte, $request->filtros()));
    }

    public function exportar(ReporteRequest $request, string $reporte)
    {
        $reporte = $this->autorizar($reporte);
        $filtros = $request->filtros();
        $nombreArchivo = $reporte->usaRangoFechas()
            ? "{$reporte->value}_{$filtros['fecha_inicio']}_{$filtros['fecha_fin']}"
            : "{$reporte->value}_" . now()->toDateString();

        if ($filtros['formato'] === 'pdf') {
            return $this->reportePdfService->generar($reporte, $filtros)->download("{$nombreArchivo}.pdf");
        }

        return Excel::download($this->reporteExcelService->generar($reporte, $filtros), "{$nombreArchivo}.xlsx");
    }

    public function vendedores(Request $request)
    {
        return response()->json($this->reporteVentasService->listarVendedores($request->query('search')));
    }

    private function autorizar(string $reporte): ReporteEnum
    {
        $reporte = ReporteEnum::from($reporte);
        Gate::authorize($reporte->permiso());

        return $reporte;
    }
}
