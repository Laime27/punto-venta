<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Categoria;
use App\Models\Producto;

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
        $productos = Producto::where('categoria_id', $categoria->id)->count();

        if ($productos > 0) {
            throw new BusinessException("No se puede eliminar la categoría {$categoria->nombre} porque tiene {$productos} producto(s) asignado(s).");
        }

        return $categoria->delete();
    }
}
