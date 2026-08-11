<?php

namespace App\Services;

use App\Models\Proveedor;

class ProveedorService
{
    public function listarProveedor()
    {
        return Proveedor::orderBy('id', 'desc')->paginate(10);
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

    public function obtenerPorId(string $id)
    {
        return Proveedor::findOrFail($id);
    }

    public function actualizarProveedor(string $id, array $datos)
    {
        $proveedor = Proveedor::findOrFail($id);
        $proveedor->update($datos);
        return $proveedor;
    }

    public function eliminarProveedor(string $id)
    {
        $proveedor = Proveedor::findOrFail($id);
        return $proveedor->delete();
    }
}
