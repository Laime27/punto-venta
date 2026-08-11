<?php

namespace App\Services;

use App\Models\Cliente;

class ClienteService
{
    public function listarCliente()
    {
        return Cliente::orderBy('id', 'desc')->paginate(10);
    }

    public function listarSelect(?string $search = null)
    {
        return Cliente::when($search, fn($q) => $q->where('nombre', 'like', "%{$search}%"))
            ->limit(10)
            ->latest('id')
            ->get(['id', 'nombre']);
    }

    public function crearCliente(array $datos)
    {
        return Cliente::create($datos);
    }

    public function obtenerPorId(string $id)
    {
        return Cliente::findOrFail($id);
    }

    public function actualizarCliente(string $id, array $datos)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update($datos);
        return $cliente;
    }

    public function eliminarCliente(string $id)
    {
        $cliente = Cliente::findOrFail($id);
        return $cliente->delete();
    }
}
