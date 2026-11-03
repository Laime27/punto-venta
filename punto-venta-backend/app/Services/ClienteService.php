<?php

namespace App\Services;

use App\Enums\EstadoComprobanteEnum;
use App\Exceptions\BusinessException;
use App\Models\Cliente;
use App\Models\ComprobanteCredito;

class ClienteService
{
    public function listarCliente($request)
    {
        $query = Cliente::query();
        if ($request->search) {
            $query->where('nombre', 'like', "%{$request->search}%");
        }
        return $query->orderBy('id', 'desc')->paginate(10);
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

    public function obtenerPorId(int $id)
    {
        return Cliente::findOrFail($id);
    }

    public function actualizarCliente(int $id, array $datos)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update($datos);
        return $cliente;
    }

    public function eliminarCliente(int $id)
    {
        $cliente = Cliente::findOrFail($id);

        if ($cliente->es_sistema) {
            throw new BusinessException("El cliente genérico del sistema no se puede eliminar.");
        }

        $deuda = (float) ComprobanteCredito::where('saldo_pendiente', '>', 0)
            ->whereHas('comprobante', fn ($query) => $query
                ->where('cliente_id', $cliente->id)
                ->where('estado', '!=', EstadoComprobanteEnum::ANULADO->value))
            ->sum('saldo_pendiente');

        if ($deuda > 0) {
            throw new BusinessException("No se puede eliminar a {$cliente->nombre} porque tiene una deuda pendiente de {$deuda}.");
        }

        return $cliente->delete();
    }

    public function obtenerOCrearClientePorDefecto()
    {
        return Cliente::firstOrCreate(
            ['es_sistema' => true],
            [
                'nombre' => 'Cliente General',
                'correo' => null,
                'telefono' => null,
                'direccion' => null,
                'nota' => 'Cliente generado por el sistema'
            ]
        );
        
    }
}
