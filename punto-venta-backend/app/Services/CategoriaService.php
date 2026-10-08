<?php

namespace App\Services;

use App\Models\Categoria;

class CategoriaService
{
    public function listarCategoria($request)
    {
        $query = Categoria::query();
        if ($request->search) {
            $query->where('nombre', 'like', "%{$request->search}%");
        }
        return $query->latest('id')->paginate(10);
    }

    public function listarSelect($search = null)
    {
        return Categoria::when($search, fn($q) => $q->where('nombre', 'like', "%{$search}%"))
            ->limit(10)
            ->latest('id')
            ->get(['id', 'nombre']);
    }


    public function crearCategoria(array $datos)
    {
        return Categoria::create($datos);
    }

    public function obtenerPorId(int $id)
    {
        return Categoria::findOrFail($id);
    }

    public function actualizarCategoria(int $id, array $datos)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update($datos);
        return $categoria;
    }

    public function eliminarCategoria(int $id)
    {
        $categoria = Categoria::findOrFail($id);
        return $categoria->delete();
    }
}
