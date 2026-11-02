<?php

namespace App\Services\Comprobante;

use App\Exceptions\BusinessException;
use App\Models\Cotizacion;
use App\Models\Producto;
use App\Services\CotizacionService;
use Illuminate\Support\Collection;

class ComprobanteCalculoService
{
    private const TOLERANCIA = 0.01;

    public function __construct(protected CotizacionService $cotizacionService) {}

    public function calcular(array $carrito, Collection $productos, array $totales, ?Cotizacion $cotizacion = null): array
    {
        $preciosCotizados = $this->obtenerPreciosCotizados($cotizacion);

        $items = collect($carrito)->map(function (array $item) use ($productos, $preciosCotizados) {
            $producto = $productos->get($item['producto_id']);

            if (!$producto) {
                throw new BusinessException("Uno de los productos del carrito ya no está disponible.");
            }

            $cantidad = (float) $item['cantidad'];
            $this->validarCantidad($producto, $cantidad);

            $precio = $this->obtenerPrecioPermitido($producto, (float) $item['precio'], $preciosCotizados->get($producto->id));

            return [
                'producto_id' => $producto->id,
                'cantidad' => $cantidad,
                'precio' => $precio,
                'subtotal' => round($cantidad * $precio, 2),
            ];
        });

        $subtotal = round($items->sum(fn (array $item) => $item['cantidad'] * $item['precio']), 2);
        $descuento = round((float) ($totales['descuento'] ?? 0), 2);
        $total = round($subtotal - $descuento, 2);

        if ($descuento > $subtotal) {
            throw new BusinessException("El descuento no puede ser mayor al subtotal de la venta.");
        }

        if (abs($total - (float) ($totales['total'] ?? 0)) > self::TOLERANCIA) {
            throw new BusinessException("El total de la venta no coincide con los productos del carrito. Actualice la página e intente nuevamente.");
        }

        return [
            'items' => $items,
            'subtotal' => $subtotal,
            'descuento' => $descuento,
            'total' => $total,
        ];
    }

    private function obtenerPreciosCotizados(?Cotizacion $cotizacion): Collection
    {
        if (!$cotizacion) {
            return collect();
        }

        return $cotizacion->detalles->mapWithKeys(fn ($detalle) => [
            $detalle->producto_id => $this->cotizacionService->precioCotizado($detalle),
        ]);
    }

    private function validarCantidad(Producto $producto, float $cantidad): void
    {
        if (!$producto->unidad?->permite_decimales && floor($cantidad) != $cantidad) {
            throw new BusinessException("El producto {$producto->nombre} no permite cantidades decimales.");
        }
    }

    private function obtenerPrecioPermitido(Producto $producto, float $precioSolicitado, ?float $precioCotizado): float
    {
        $preciosPermitidos = $precioCotizado !== null
            ? collect([$precioCotizado])
            : collect([(float) $producto->precio_venta])->when((float) $producto->precio_mayoreo > 0, fn ($precios) => $precios->push((float) $producto->precio_mayoreo));

        $precio = $preciosPermitidos->first(fn ($permitido) => abs($permitido - $precioSolicitado) <= self::TOLERANCIA);

        if ($precio === null) {
            $referencia = $precioCotizado !== null ? 'al precio cotizado' : 'a su precio de venta o de mayoreo';
            throw new BusinessException("El precio de {$producto->nombre} no corresponde {$referencia}.");
        }

        return $precio;
    }
}
