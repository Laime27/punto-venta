<?php

namespace App\Services;

use App\Enums\TipoMovimientoEnum;
use App\Models\HistorialMovimiento;
use App\Models\Producto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ProductoImport;
use App\Imports\ProductoLecturaImport;

class ProductoService
{
    public function __construct(
        protected ImagenService $imagenService,
        protected CodigoBarrasService $codigoBarrasService
    ) {}

    public function generarCodigoBarras(): string
    {
        return $this->codigoBarrasService->generar();
    }

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

            if (blank($producto->codigo_barras)) {
                $producto->update(['codigo_barras' => $this->codigoBarrasService->generar($producto->id)]);
            }

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

        if (array_key_exists('codigo_barras', $datos) && blank($datos['codigo_barras'])) {
            $datos['codigo_barras'] = $producto->codigo_barras ?: $this->codigoBarrasService->generar($producto->id);
        }

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
        $filas = $this->leerFilasExcel($archivo);

        if (empty($filas)) {
            return [
                'exito'   => false,
                'mensaje' => 'El archivo no contiene productos para importar.',
                'errores' => [],
                'filas'   => [],
            ];
        }

        $resultado = $this->importarFilasProductos($filas, $userId);

        if (! $resultado['exito']) {
            $resultado['mensaje'] = 'No se importó ningún producto debido a errores en el archivo. Corrija los errores e intente nuevamente.';
            $resultado['filas'] = $filas;
        }

        return $resultado;
    }

    public function importarFilasProductos(array $filas, int $userId): array
    {
        $import = new ProductoImport($userId);
        $filas = array_map(fn (array $fila) => $this->normalizarFilaImportacion($fila), $filas);
        $errores = $this->validarFilasImportacion($filas, $import);

        if (!empty($errores)) {
            return [
                'exito'   => false,
                'mensaje' => 'Aún hay errores en los datos. Corrija las celdas marcadas e intente nuevamente.',
                'errores' => $errores,
            ];
        }

        DB::transaction(function () use ($filas, $import) {
            foreach ($filas as $fila) {
                $import->model($fila);
            }
        });

        return [
            'exito'   => true,
            'mensaje' => 'Productos importados correctamente',
        ];
    }

    /**
     * Valida TODAS las filas (no se detiene en la primera con error)
     * para que el usuario vea y corrija todos los errores de una vez.
     */
    private function validarFilasImportacion(array $filas, ProductoImport $import): array
    {
        $errores = [];
        $codigosVistos = [];
        $nombresVistos = [];

        foreach ($filas as $fila) {
            $validator = Validator::make(
                $fila,
                $import->rules(),
                $import->customValidationMessages(),
                $import->customValidationAttributes()
            );

            foreach ($validator->errors()->messages() as $campo => $mensajes) {
                $errores[] = [
                    'fila'    => $fila['fila'],
                    'campo'   => $campo,
                    'errores' => $mensajes,
                ];
            }

            $codigo = (string) ($fila['codigo_barras'] ?? '');
            if ($codigo !== '') {
                if (isset($codigosVistos[$codigo])) {
                    $errores[] = [
                        'fila'    => $fila['fila'],
                        'campo'   => 'codigo_barras',
                        'errores' => ["El código de barras está repetido en la fila {$codigosVistos[$codigo]} del archivo."],
                    ];
                } else {
                    $codigosVistos[$codigo] = $fila['fila'];
                }
            }

            $nombre = (string) ($fila['nombre'] ?? '');
            if ($nombre === '') {
                continue;
            }

            // Igual que la collation de la BD (ai_ci): ignora mayúsculas y tildes
            $claveNombre = Str::lower(Str::ascii($nombre));

            if (isset($nombresVistos[$claveNombre])) {
                $errores[] = [
                    'fila'    => $fila['fila'],
                    'campo'   => 'nombre',
                    'errores' => ["El nombre está repetido en la fila {$nombresVistos[$claveNombre]} del archivo."],
                ];
                continue;
            }
            $nombresVistos[$claveNombre] = $fila['fila'];

            $otroProducto = $this->productoConMismoNombre($nombre, $codigo);
            if ($otroProducto) {
                $errores[] = [
                    'fila'    => $fila['fila'],
                    'campo'   => 'nombre',
                    'errores' => ["Ya existe otro producto con este nombre (código {$otroProducto->codigo_barras})."],
                ];
            }
        }

        return $errores;
    }

    /**
     * Sin código de barras la fila actualiza el producto por nombre, así que no hay conflicto.
     * Con código, el nombre no puede pertenecer a un producto con otro código (nombre único, igual que ProductoRequest).
     */
    private function productoConMismoNombre(string $nombre, string $codigo): ?Producto
    {
        if ($codigo === '') {
            return null;
        }

        return Producto::where('nombre', $nombre)
            ->where(fn ($q) => $q->whereNull('codigo_barras')->orWhere('codigo_barras', '!=', $codigo))
            ->first();
    }

    /**
     * Quita espacios al inicio/fin y deja un solo espacio entre palabras
     * ("  Coca   Cola " => "Coca Cola"), incluidos espacios no separables pegados desde Excel.
     */
    private function normalizarFilaImportacion(array $fila): array
    {
        foreach (['nombre', 'categoria', 'unidad', 'codigo_barras', 'descripcion'] as $campo) {
            if (!isset($fila[$campo]) || !is_string($fila[$campo])) {
                continue;
            }

            $valor = $campo === 'descripcion'
                ? trim($fila[$campo])
                : trim(preg_replace('/[\s\x{00A0}]+/u', ' ', $fila[$campo]));

            $fila[$campo] = $valor === '' ? null : $valor;
        }

        return $fila;
    }

    private function leerFilasExcel(UploadedFile $archivo): array
    {
        $hoja = Excel::toArray(new ProductoLecturaImport, $archivo)[0] ?? [];
        $filas = [];

        foreach ($hoja as $indice => $fila) {
            if (collect($fila)->filter(fn ($valor) => !blank($valor))->isEmpty()) {
                continue;
            }

            $filas[] = $this->normalizarFilaImportacion(['fila' => $indice + 2] + array_map(
                fn ($valor) => is_float($valor) && floor($valor) == $valor ? (int) $valor : $valor,
                $fila
            ));
        }

        return $filas;
    }
}
