<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClienteRequest;
use App\Services\ClienteService;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function __construct(protected ClienteService $clienteService) {}

    public function index(Request $request)
    {
        return response()->json($this->clienteService->listarCliente($request));
    }

    public function listarSelect(Request $request)
    {
        return response()->json($this->clienteService->listarSelect($request->query('search')));
    }

    public function store(ClienteRequest $request)
    {
        $cliente = $this->clienteService->crearCliente($request->validated());
        return response()->json($cliente, 201);
    }

    public function show(int $id)
    {
        return response()->json($this->clienteService->obtenerPorId($id));
    }

    public function update(ClienteRequest $request, int $id)
    {
        $cliente = $this->clienteService->actualizarCliente($id, $request->validated());
        return response()->json($cliente);
    }

    public function destroy(int $id)
    {
        $this->clienteService->eliminarCliente($id);
        return response()->json(null, 204);
    }
}
