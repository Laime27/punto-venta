<?php

namespace App\Http\Controllers;

use App\Http\Requests\RolRequest;
use App\Services\RolService;

class RolController extends Controller
{
    public function __construct(protected RolService $rolService) {}

    public function index()
    {
        return response()->json($this->rolService->listar());
    }

    public function listarSelect()
    {
        return response()->json($this->rolService->listarSelect());
    }

    public function permisos()
    {
        return response()->json($this->rolService->listarGruposPermisos());
    }

    public function show(int $id)
    {
        return response()->json($this->rolService->obtener($id));
    }

    public function store(RolRequest $request)
    {
        return response()->json($this->rolService->crear($request->validated()), 201);
    }

    public function update(RolRequest $request, int $id)
    {
        return response()->json($this->rolService->actualizar($id, $request->validated()));
    }

    public function destroy(int $id)
    {
        $this->rolService->eliminar($id);

        return response()->json(null, 204);
    }
}
