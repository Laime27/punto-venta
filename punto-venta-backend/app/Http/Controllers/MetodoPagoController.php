<?php

namespace App\Http\Controllers;

use App\Http\Requests\MetodoPagoRequest;
use App\Services\MetodoPagoService;
use Illuminate\Http\Request;

class MetodoPagoController extends Controller
{
    protected MetodoPagoService $metodoPagoService;

    public function __construct(MetodoPagoService $metodoPagoService)
    {
        $this->metodoPagoService = $metodoPagoService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search') ?? '';
        $metodos = $this->metodoPagoService->listarMetodoPago($search);
        return response()->json($metodos);
    }

    public function listarTodos()
    {
        $metodos = $this->metodoPagoService->listarTodos();
        return response()->json($metodos);
    }

    public function store(MetodoPagoRequest $request)
    {
        $metodo = $this->metodoPagoService->crearMetodoPago($request->validated());
        return response()->json($metodo, 201);
    }

    public function show(string $id)
    {
        $metodo = $this->metodoPagoService->obtenerPorId($id);
        return response()->json($metodo);
    }

    public function update(MetodoPagoRequest $request, string $id)
    {
        $metodo = $this->metodoPagoService->actualizarMetodoPago($id, $request->validated());
        return response()->json($metodo);
    }

    public function destroy(string $id)
    {
        $this->metodoPagoService->eliminarMetodoPago($id);
        return response()->json(null, 204);
    }
}
