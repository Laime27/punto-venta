<?php

namespace App\Http\Controllers;

use App\Http\Requests\KardexRequest;
use App\Services\KardexService;
use App\Services\Reporte\ReporteExcelService;
use Maatwebsite\Excel\Facades\Excel;

class KardexController extends Controller
{
    public function __construct(
        protected KardexService $kardexService,
        protected ReporteExcelService $reporteExcelService
    ) {}

    public function show(KardexRequest $request, int $id)
    {
        return response()->json($this->kardexService->obtenerKardex($id, $request->validated()));
    }

    public function exportar(KardexRequest $request, int $id)
    {
        return Excel::download(
            $this->reporteExcelService->kardex($id, $request->validated()),
            "kardex_producto_{$id}.xlsx"
        );
    }
}
