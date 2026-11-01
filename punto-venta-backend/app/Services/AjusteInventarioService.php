<?php

namespace App\Services;

use App\Enums\TipoComprobanteEnum;
use App\Enums\TipoMovimientoEnum;
use App\Exceptions\BusinessException;
use App\Models\AjusteInventario;
use App\Models\AjusteInventarioDetalle;
use App\Models\HistorialMovimiento;
use App\Models\Producto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AjusteInventarioService
{
    public function __construct(protected TipoComprobanteService $tipoComprobanteService) {}

    public function listarAjustes($request)
    {
        return AjusteInventario::with(['tipoMovimiento:id,nombre', 'user:id,name'])
            ->withCount('detalles')
            ->when($request->query('tipo_movimiento_id'), fn($q, $tipo) => $q->where('tipo_movimiento_id', $tipo))
            ->when($request->query('fecha_inicio'), fn($q, $fecha) => $q->whereDate('fecha_emision', '>=', $fecha))
            ->when($request->query('fecha_fin'), fn($q, $fecha) => $q->whereDate('fecha_emision', '<=', $fecha))
            ->when($request->query('search'), function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('correlativo', 'like', "%{$search}%")
                      ->orWhere('motivo', 'like', "%{$search}%")
                      ->orWhereHas('detalles.producto', fn($p) => $p->where(fn($p) => $p->where('nombre', 'like', "%{$search}%")->orWhere('codigo_barras', 'like', "%{$search}%")));
                });
            })
            ->latest('id')
            ->paginate($request->query('per_page', 10));
    }

    public function mostrar(int $id): AjusteInventario
    {
        return AjusteInventario::with([
            'tipoMovimiento:id,nombre',
            'user:id,name',
            'detalles.producto:id,nombre,codigo_barras,unidad_id',
            'detalles.producto.unidad:id,nombre,abreviatura',
        ])->findOrFail($id);
    }

    public function crearAjuste(array $data): AjusteInventario
    {
        $tipo = TipoMovimientoEnum::from((int) $data['tipo_movimiento_id']);

        return DB::transaction(function () use ($data, $tipo) {
            $productos = Producto::with('unidad:id,nombre,permite_decimales')
                ->whereIn('id', collect($data['detalles'])->pluck('producto_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $infoComprobante = $this->tipoComprobanteService->procesarSiguienteCorrelativo(TipoComprobanteEnum::AJUSTE_INVENTARIO->value);

            $ajuste = AjusteInventario::create([
                'serie_id' => $infoComprobante['tipo_comprobante_id'],
                'serie' => $infoComprobante['serie'],
                'correlativo' => $infoComprobante['correlativo'],
                'tipo_movimiento_id' => $tipo->value,
                'motivo' => $data['motivo'] ?? null,
                'fecha_emision' => now(),
                'user_id' => Auth::id(),
            ]);

            foreach ($data['detalles'] as $detalle) {
                $this->procesarDetalle($ajuste, $tipo, $productos[$detalle['producto_id']], (float) $detalle['cantidad']);
            }

            return $this->mostrar($ajuste->id);
        });
    }

 
    private function procesarDetalle(AjusteInventario $ajuste, TipoMovimientoEnum $tipo, Producto $producto, float $cantidad): void
    {
        $this->validarCantidad($tipo, $producto, $cantidad);

        $stockAnterior = (float) $producto->stock;
        $stockActual = $tipo === TipoMovimientoEnum::RECUENTO_INVENTARIO ? $cantidad : round($stockAnterior - $cantidad, 2);
        $diferencia = round($stockActual - $stockAnterior, 2);

        AjusteInventarioDetalle::create([
            'ajuste_inventario_id' => $ajuste->id,
            'producto_id' => $producto->id,
            'cantidad' => $cantidad,
            'stock_anterior' => $stockAnterior,
            'stock_actual' => $stockActual,
            'diferencia' => $diferencia,
            'costo_unitario' => $producto->precio_compra ?? 0,
        ]);

        if ($diferencia == 0) return;

        $producto->update(['stock' => $stockActual]);

        HistorialMovimiento::create([
            'producto_id' => $producto->id,
            'user_id' => Auth::id(),
            'tipo_movimiento_id' => $tipo->value,
            'documento_id' => $ajuste->id,
            'documento_type' => AjusteInventario::class,
            'operacion' => $diferencia > 0 ? '+' : '-',
            'cantidad' => abs($diferencia),
            'stock_anterior' => $stockAnterior,
            'stock_actual' => $stockActual,
            'observacion' => $ajuste->motivo ?: 'Ajuste de inventario ' . $ajuste->serie . '-' . $ajuste->correlativo,
            'fecha_emision' => $ajuste->fecha_emision,
        ]);
    }

    private function validarCantidad(TipoMovimientoEnum $tipo, Producto $producto, float $cantidad): void
    {
        if (!($producto->unidad?->permite_decimales) && floor($cantidad) != $cantidad) {
            throw new BusinessException("El producto {$producto->nombre} no permite cantidades decimales.");
        }

        if ($tipo === TipoMovimientoEnum::RECUENTO_INVENTARIO) return;

        if ($cantidad <= 0) {
            throw new BusinessException("La cantidad de {$producto->nombre} debe ser mayor a 0.");
        }

        if ($cantidad > (float) $producto->stock) {
            throw new BusinessException("La cantidad de {$producto->nombre} ({$cantidad}) supera el stock disponible ({$producto->stock}).");
        }
    }
}
