<?php

namespace App\Http\Controllers;

use App\Http\Requests\HistorialMovimientoRequest;
use App\Services\HistorialMovimientoService;

class HistorialMovimientoController extends Controller
{
    public function __construct(protected HistorialMovimientoService $historialMovimientoService) {}

    public function index(HistorialMovimientoRequest $request)
    {
        $historial = $this->historialMovimientoService->listarHistorialMovimientos($request->validated());

        return response()->json([
            'status' => 'success',
            'data' => $historial
        ]);
    }

    public function tipos()
    {
        return response()->json($this->historialMovimientoService->listarTipos());
    }
}
