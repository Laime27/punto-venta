<?php

namespace App\Services;

use App\Models\MetodoPago;

class MetodoPagoService
{
    public function listarMetodoPago($search = "")
    {
        return MetodoPago::when($search, fn($q) => $q->where('nombre', 'like', "%{$search}%"))
            ->latest('id')
            ->paginate(10);
    }

    public function listarTodos()
    {
        return MetodoPago::latest('id')->get();
    }

    public function crearMetodoPago(array $datos)
    {
        return MetodoPago::create($datos);
    }

    public function obtenerPorId(string $id)
    {
        return MetodoPago::findOrFail($id);
    }

    public function actualizarMetodoPago(string $id, array $datos)
    {
        $metodoPago = MetodoPago::findOrFail($id);
        $metodoPago->update($datos);
        return $metodoPago;
    }

    public function eliminarMetodoPago(string $id)
    {
        $metodoPago = MetodoPago::findOrFail($id);
        return $metodoPago->delete();
    }
}
