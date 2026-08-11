<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriaRequest;
use App\Services\CategoriaService;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    protected CategoriaService $categoriaService;

    public function __construct(CategoriaService $categoriaService)
    {
        $this->categoriaService = $categoriaService;
    }

    public function index(Request $request)
    {
        $search = $request->query('search') ?? '';
        $categorias = $this->categoriaService->listarCategoria($search);
        return response()->json($categorias);
    }

    public function listarSelect(Request $request)
    {
        $categorias = $this->categoriaService->listarSelect($request->query('search'));
        return response()->json($categorias);
    }

    public function store(CategoriaRequest $request)
    {
        $categoria = $this->categoriaService->crearCategoria($request->validated());
        return response()->json($categoria, 201);
    }

    public function show(string $id)
    {
        $categoria = $this->categoriaService->obtenerPorId($id);
        return response()->json($categoria);
    }
    public function update(CategoriaRequest $request, string $id)
    {
        $categoria = $this->categoriaService->actualizarCategoria($id, $request->validated());
        return response()->json($categoria);
    }

    public function destroy(string $id)
    {
        $this->categoriaService->eliminarCategoria($id);
        return response()->json(null, 204);
    }
}
