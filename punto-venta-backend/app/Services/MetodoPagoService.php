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
        return MetodoPago::latest('id')->where('activo', true)->get();
    }

    public function crearMetodoPago(array $datos)
    {
        return MetodoPago::create($datos);
    }

    public function obtenerPorId(int $id)
    {
        return MetodoPago::findOrFail($id);
    }

    public function actualizarMetodoPago(int $id, array $datos)
    {
        $metodoPago = MetodoPago::findOrFail($id);
        $metodoPago->update($datos);
        return $metodoPago;
    }

    public function cambiarEstado(int $id)
    {
        $metodoPago = MetodoPago::findOrFail($id);

        $metodoPago->update([
            'activo' => !$metodoPago->activo,
        ]);

        $mensaje = $metodoPago->activo ? 'Método de pago activado correctamente' : 'Método de pago desactivado correctamente';

        return [
            'mensaje' => $mensaje,
            'activo' => $metodoPago->activo,
        ];
    }
}
