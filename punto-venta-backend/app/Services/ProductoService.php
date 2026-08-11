<?php

namespace App\Services;

use App\Models\Producto;

class ProductoService
{
    public function __construct(protected ImagenService $imagenService) {}

    public function listarSelectProducto($search = null)
    {
        $query = Producto::query();

        $query->where('disponible_venta', true);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('codigo_barras', 'like', "%{$search}%");
            });
        }

        return $query->with('unidad:id,nombre,permite_decimales')->limit(10)->get(['id', 'nombre', 'precio_venta', 'precio_mayoreo', 'stock', 'codigo_barras', 'unidad_id', 'imagen']);
    }

    public function listarProductos($request)
    {

        $query = Producto::with(['categoria','unidad','proveedores:id,nombre']);
       
        if ($request->categoria_id) {
            $query->where('categoria_id', $request->categoria_id);
        }

        if ($request->stock === 'stock_bajo') {
            $query->whereColumn('stock', '<=', 'stock_minimo');
        }

        if ($request->stock === 'stock_normal') {
            $query->whereColumn('stock', '>', 'stock_minimo');
        }
       
        if ($request->filled('disponibilidad')) {
            $query->where('disponible_venta', $request->disponibilidad);
        }

        if ($request->buscar) {
            $query->where('nombre', 'like', "%{$request->buscar}%");
        }

        $productos = $query->orderBy('id', 'desc')->paginate(10);
        
        $stats = (clone $query)->selectRaw("
            ROUND(SUM(stock * precio_compra), 2) as total_costo,
            ROUND(SUM(stock * precio_venta), 2) as total_venta,
            ROUND(SUM(stock * (precio_venta - precio_compra)), 2) as utilidad_proyectada
        ")->first();

        return [
            'productos' => $productos,
            'stats' => $stats
        ];
    }

    public function crearProducto(array $datos, $imagen = null): Producto
    {
        if ($imagen) {
            $datos['imagen'] = $this->imagenService->guardar($imagen, 'productos');
        }

        $proveedores = $datos['proveedores'] ?? [];
        unset($datos['proveedores']);

        $producto = Producto::create($datos);

        if (!empty($proveedores)) {
            $producto->proveedores()->sync($proveedores);
        }

        return $producto->load(['categoria', 'unidad', 'proveedores']);
    }

    public function obtenerPorId(string $id): Producto
    {
        return Producto::with(['categoria', 'unidad', 'proveedores'])->findOrFail($id);
    }

    public function actualizarProducto(string $id, array $datos, $imagen = null): Producto
    {
        $producto = Producto::findOrFail($id);

        if ($imagen) {
            $datos['imagen'] = $this->imagenService->actualizar($producto->imagen, $imagen, 'productos');
        }

        $proveedores = $datos['proveedores'] ?? null;
        unset($datos['proveedores']);

        $producto->update($datos);

        if ($proveedores !== null) {
            $producto->proveedores()->sync($proveedores);
        }

        return $producto->load(['categoria', 'unidad', 'proveedores']);
    }

    public function eliminarProducto(string $id): void
    {
        Producto::findOrFail($id)->delete();
    }
    
}
