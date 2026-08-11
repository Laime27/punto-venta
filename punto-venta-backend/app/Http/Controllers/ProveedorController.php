<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProveedorRequest;
use App\Services\ProveedorService;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function __construct(protected ProveedorService $proveedorService) {}

    public function index()
    {
        return response()->json($this->proveedorService->listarProveedor());
    }

    public function listarSelect(Request $request)
    {
        return response()->json($this->proveedorService->listarSelect($request->query('search')));
    }

    public function store(ProveedorRequest $request)
    {
        $proveedor = $this->proveedorService->crearProveedor($request->validated());
        return response()->json($proveedor, 201);
    }

    public function show(string $id)
    {
        return response()->json($this->proveedorService->obtenerPorId($id));
    }

    public function update(ProveedorRequest $request, string $id)
    {
        $proveedor = $this->proveedorService->actualizarProveedor($id, $request->validated());
        return response()->json($proveedor);
    }

    public function destroy(string $id)
    {
        $this->proveedorService->eliminarProveedor($id);
        return response()->json(null, 204);
    }
}
