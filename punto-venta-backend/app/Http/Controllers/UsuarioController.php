<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsuarioRequest;
use App\Services\UsuarioService;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function __construct(protected UsuarioService $usuarioService) {}

    public function index(Request $request)
    {
        $filtros = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'rol_id' => ['nullable', 'integer', 'exists:roles,id'],
            'activo' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'in:10,15,20,50'],
        ]);

        return response()->json($this->usuarioService->listar($filtros));
    }

    public function show(int $id)
    {
        return response()->json($this->usuarioService->obtener($id));
    }

    public function store(UsuarioRequest $request)
    {
        return response()->json($this->usuarioService->crear($request->validated()), 201);
    }

    public function update(UsuarioRequest $request, int $id)
    {
        return response()->json($this->usuarioService->actualizar($id, $request->validated()));
    }

    public function cambiarEstado(Request $request, int $id)
    {
        return response()->json($this->usuarioService->cambiarEstado($id, $request->user()->id));
    }
}
