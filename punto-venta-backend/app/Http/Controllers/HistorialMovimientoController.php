<?php

namespace App\Http\Controllers;

use App\Services\HistorialMovimientoService;
use Illuminate\Http\Request;

class HistorialMovimientoController extends Controller
{
    protected $historialMovimientoService;

    public function __construct(HistorialMovimientoService $historialMovimientoService)
    {
        $this->historialMovimientoService = $historialMovimientoService;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $historial = $this->historialMovimientoService->ListarHistorialMovimientos($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $historial
        ]);
    }
}
