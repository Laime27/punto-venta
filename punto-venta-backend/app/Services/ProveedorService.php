<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Proveedor;

class ProveedorService
{
    public function listarProveedor($request)
    {
        $query = Proveedor::query();
        if ($request->search) {
            $query->where('nombre', 'like', "%{$request->search}%");
        }
        return $query->orderBy('id', 'desc')->paginate(10);
    }

    public function listarSelect(?string $search = null)
    {
        return Proveedor::when($search, fn($q) => $q->where('nombre', 'like', "%{$search}%"))
            ->limit(10)
            ->latest('id')
            ->get(['id', 'nombre']);
    }

    public function crearProveedor(array $datos)
    {
        return Proveedor::create($datos);
    }

    public function obtenerPorId(int $id)
    {
        return Proveedor::findOrFail($id);
    }

    public function actualizarProveedor(int $id, array $datos)
    {
        $proveedor = Proveedor::findOrFail($id);
        $proveedor->update($datos);
        return $proveedor;
    }

    public function eliminarProveedor(int $id)
    {
        $proveedor = Proveedor::findOrFail($id);

        if ($proveedor->ordenesCompra()->exists()) {
            throw new BusinessException("No se puede eliminar a {$proveedor->nombre} porque tiene órdenes de compra registradas.");
        }

        return $proveedor->delete();
    }
}
