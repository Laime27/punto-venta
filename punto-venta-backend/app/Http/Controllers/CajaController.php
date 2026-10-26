<?php

namespace App\Http\Controllers;

use App\Http\Requests\AbrirCajaRequest;
use App\Http\Requests\CerrarCajaRequest;
use App\Http\Requests\MovimientoCajaRequest;
use App\Services\Caja\CajaService;
use App\Services\Caja\MovimientoCajaService;
use Illuminate\Http\Request;

class CajaController extends Controller
{
    public function __construct(
        protected CajaService $cajaService,
        protected MovimientoCajaService $movimientoCajaService
    ) {}

    public function index(Request $request)
    {
        return response()->json($this->cajaService->listar($request));
    }

    public function show(int $id)
    {
        return response()->json($this->cajaService->mostrar($id));
    }

    public function estadoActual()
    {
        $caja = $this->cajaService->obtenerCajaActiva();
        return response()->json([
            'activa' => (bool) $caja,
            'caja_id' => $caja?->id,
        ]);
    }

    public function abrir(AbrirCajaRequest $request)
    {
        $caja = $this->cajaService->abrir($request->validated());

        return response()->json([
            'message' => 'Caja aperturada exitosamente',
            'data' => $caja,
        ], 201);
    }

    public function cerrar(CerrarCajaRequest $request, int $id)
    {
        $resultado = $this->cajaService->cerrar($id, $request->validated());

        return response()->json([
            'message' => 'Caja cerrada exitosamente',
            'data' => $resultado,
        ]);
    }

    public function resumen(int $id)
    {
        return response()->json($this->cajaService->obtenerResumen($id));
    }

    public function registrarMovimiento(MovimientoCajaRequest $request)
    {
        $movimiento = $this->movimientoCajaService->registrar($request->validated());

        return response()->json([
            'message' => 'Movimiento registrado exitosamente',
            'data' => $movimiento,
        ], 201);
    }

    public function listarMovimientos(Request $request, int $id)
    {
        return response()->json($this->movimientoCajaService->listarPorCaja($id, $request->query('tipo')));
    }
}
