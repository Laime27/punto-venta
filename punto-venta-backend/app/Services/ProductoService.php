<?php

namespace App\Services;

use App\Enums\TipoMovimientoEnum;
use App\Models\HistorialMovimiento;
use App\Models\Producto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException as ExcelValidationException;
use App\Imports\ProductoImport;

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

        return $query->with('unidad:id,nombre,permite_decimales')->limit(10)->get(['id', 'nombre', 'precio_venta', 'precio_mayoreo','precio_compra', 'stock', 'codigo_barras', 'unidad_id', 'imagen']);
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

        if ($request->search) {
            $query->where('nombre', 'like', "%{$request->search}%")->orWhere('codigo_barras', 'like', "%{$request->search}%");
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

        $producto = DB::transaction(function () use ($datos, $proveedores) {
            $producto = Producto::create($datos);

            $this->registrarCambioStock($producto, 0, (float) ($datos['stock'] ?? 0), TipoMovimientoEnum::ARTICULO_CREADO, 'Stock inicial al crear el producto');

            if (!empty($proveedores)) {
                $producto->proveedores()->sync($proveedores);
            }

            return $producto;
        });

        return $producto->load(['categoria', 'unidad', 'proveedores']);
    }

    public function obtenerPorId(int $id): Producto
    {
        return Producto::with(['categoria', 'unidad', 'proveedores'])->findOrFail($id);
    }

    public function actualizarProducto(int $id, array $datos, $imagen = null): Producto
    {
        $producto = Producto::findOrFail($id);

        if ($imagen) {
            $datos['imagen'] = $this->imagenService->actualizar($producto->imagen, $imagen, 'productos');
        }

        $proveedores = $datos['proveedores'] ?? null;
        unset($datos['proveedores']);

        DB::transaction(function () use ($producto, $datos, $proveedores) {
            $stockAnterior = (float) Producto::whereKey($producto->id)->lockForUpdate()->value('stock');

            $producto->update($datos);

            if (array_key_exists('stock', $datos) && $datos['stock'] !== null) {
                $this->registrarCambioStock($producto, $stockAnterior, (float) $datos['stock'], TipoMovimientoEnum::ARTICULO_EDITADO, 'Stock modificado al editar el producto');
            }

            if ($proveedores !== null) {
                $producto->proveedores()->sync($proveedores);
            }
        });

        return $producto->load(['categoria', 'unidad', 'proveedores']);
    }

    private function registrarCambioStock(Producto $producto, float $stockAnterior, float $stockNuevo, TipoMovimientoEnum $tipo, string $observacion): void
    {
        $diferencia = round($stockNuevo - $stockAnterior, 2);

        if ($diferencia == 0) return;

        HistorialMovimiento::create([
            'producto_id' => $producto->id,
            'user_id' => Auth::id() ?? 1,
            'tipo_movimiento_id' => $tipo->value,
            'operacion' => $diferencia > 0 ? '+' : '-',
            'cantidad' => abs($diferencia),
            'stock_anterior' => $stockAnterior,
            'stock_actual' => $stockNuevo,
            'observacion' => $observacion,
            'fecha_emision' => now(),
        ]);
    }

    public function eliminarProducto(int $id): void
    {
        Producto::findOrFail($id)->delete();
    }

    public function importarProductos(UploadedFile $archivo, int $userId): array
    {
        try {
            DB::transaction(function () use ($archivo, $userId) {
                Excel::import(new ProductoImport($userId), $archivo);
            });

            return [
                'exito'   => true,
                'mensaje' => 'Productos importados correctamente',
            ];
        } catch (ExcelValidationException $e) {
            $errores = [];
            foreach ($e->failures() as $failure) {
                $errores[] = [
                    'fila'    => $failure->row(),
                    'campo'   => $failure->attribute(),
                    'errores' => $failure->errors(),
                    'valores' => $failure->values(),
                ];
            }

            return [
                'exito'   => false,
                'mensaje' => 'No se importó ningún producto debido a errores en el archivo. Corrija los errores e intente nuevamente.',
                'errores' => $errores,
            ];
        }
    }
}
