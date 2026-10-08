<?php

namespace App\Http\Controllers;

use App\Http\Requests\ComprobanteRequest;
use App\Services\ComprobanteService;
use Exception;

class ComprobanteController extends Controller
{
    protected $comprobanteService;

    public function __construct(ComprobanteService $comprobanteService)
    {
        $this->comprobanteService = $comprobanteService;
    }

    public function registrarVenta(ComprobanteRequest $request)
    {
        $comprobante = $this->comprobanteService->registrarVenta($request->validated());
        
        return response()->json([
            'message' => 'Venta registrada exitosamente',
            'data' => $comprobante
        ], 201);
    }
}
