<?php

namespace App\Services;

use App\Models\Categoria;

class CategoriaService
{
    public function listarCategoria($search = "")
    {
        return Categoria::when($search, fn($q) => $q->where('nombre', 'like', "%{$search}%"))
            ->latest('id')
            ->paginate(10);
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

    public function obtenerPorId(string $id)
    {
        return Categoria::findOrFail($id);
    }

    public function actualizarCategoria(string $id, array $datos)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update($datos);
        return $categoria;
    }

    public function eliminarCategoria(string $id)
    {
        $categoria = Categoria::findOrFail($id);
        return $categoria->delete();
    }
}
