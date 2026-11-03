<?php

namespace App\Services\OrdenCompra;

use App\Models\OrdenCompra;
use App\Models\OrdenCompraDetalle;
use App\Enums\EstadoOrdenCompraEnum;
use App\Enums\TipoComprobanteEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\BusinessException;
use App\Services\TipoComprobanteService;

class OrdenCompraService
{

    protected $tipoComprobanteService;

    public function __construct(TipoComprobanteService $tipoComprobanteService)
    {
        $this->tipoComprobanteService = $tipoComprobanteService;
    }

    public function listarOrdenesCompra()
    {
        return OrdenCompra::with(['proveedor:id,nombre', 'user:id,name'])->orderBy('id', 'desc')->paginate(10);
    }

    public function crearOrdenCompra(array $data)
    {
        return DB::transaction(function () use ($data) {
            $totalEstimado = $this->calcularTotalEstimado($data['detalles']);

            $infoComprobante = $this->tipoComprobanteService->procesarSiguienteCorrelativo(TipoComprobanteEnum::ORDEN_COMPRA->value);

            $ordenCompra = OrdenCompra::create([
                'proveedor_id' => $data['proveedor_id'] ?? null,
                'serie_id' => $infoComprobante['tipo_comprobante_id'],
                'serie' => $infoComprobante['serie'],
                'correlativo' => $infoComprobante['correlativo'],
                'fecha_emision' => $data['fecha_emision'] ?? now(),
                'fecha_recepcion' => $data['fecha_recepcion'] ?? null,
                'estado' => $data['estado'] ?? 'PENDIENTE',
                'total_estimado' => $totalEstimado,
                'total_real' => 0,
                'observaciones' => $data['observaciones'] ?? null,
                'user_id' => Auth::id(),
            ]);

            $this->sincronizarDetalles($ordenCompra, $data['detalles']);

            return $ordenCompra->load('detalles');
        });
    }

    public function actualizarOrdenCompra(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $ordenCompra = OrdenCompra::findOrFail($id);

            if ($ordenCompra->estado !== EstadoOrdenCompraEnum::PENDIENTE->value) {
                throw new BusinessException("Solo se pueden editar órdenes de compra en estado PENDIENTE.");
            }

            $totalEstimado = $this->calcularTotalEstimado($data['detalles']);

            $ordenCompra->update([
                'proveedor_id' => $data['proveedor_id'] ?? $ordenCompra->proveedor_id,
                'fecha_emision' => $data['fecha_emision'] ?? $ordenCompra->fecha_emision,
                'fecha_recepcion' => $data['fecha_recepcion'] ?? $ordenCompra->fecha_recepcion,
                'observaciones' => $data['observaciones'] ?? $ordenCompra->observaciones,
                'total_estimado' => $totalEstimado,
            ]);

            $this->sincronizarDetalles($ordenCompra, $data['detalles']);

            return $ordenCompra->load('detalles');
        });
    }

    public function anular(int $id): OrdenCompra
    {
        return DB::transaction(function () use ($id) {
            $ordenCompra = OrdenCompra::lockForUpdate()->findOrFail($id);

            if ($ordenCompra->estado !== EstadoOrdenCompraEnum::PENDIENTE->value) {
                throw new BusinessException("Solo se pueden anular órdenes de compra en estado PENDIENTE.");
            }

            $ordenCompra->update(['estado' => EstadoOrdenCompraEnum::ANULADA->value]);

            return $ordenCompra;
        });
    }

    public function mostrar($id)
    {
        return OrdenCompra::with(['proveedor', 'user', 'detalles.producto'])->findOrFail($id);
    }

    private function calcularTotalEstimado(array $detalles): float
    {
        $totalEstimado = 0;
        foreach ($detalles as $detalle) {
            $totalEstimado += $detalle['cantidad_pedida'] * $detalle['precio_unitario'];
        }
        return $totalEstimado;
    }

    private function sincronizarDetalles(OrdenCompra $ordenCompra, array $detalles)
    {
        $productosEnviados = collect($detalles)->pluck('producto_id')->toArray();
        $ordenCompra->detalles()->whereNotIn('producto_id', $productosEnviados)->delete();

        foreach ($detalles as $detalle) {
            $subtotal = $detalle['cantidad_pedida'] * $detalle['precio_unitario'];
            
            $detalleModel = OrdenCompraDetalle::firstOrNew([
                'orden_compra_id' => $ordenCompra->id,
                'producto_id' => $detalle['producto_id'],
            ]);

            $detalleModel->cantidad_pedida = $detalle['cantidad_pedida'];
            $detalleModel->precio_unitario = $detalle['precio_unitario'];
            $detalleModel->subtotal = $subtotal;
            
            if (!$detalleModel->exists) {
                $detalleModel->cantidad_recibida = 0;
            }
            
            $detalleModel->save();
        }
    }
}
