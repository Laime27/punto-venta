<?php

namespace App\Imports;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Unidad;
use App\Models\HistorialMovimiento;
use App\Models\User;
use App\Enums\TipoMovimientoEnum;
use App\Services\CodigoBarrasService;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class ProductoImport implements ToModel, WithHeadingRow, WithValidation, SkipsEmptyRows
{
    protected $userId;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    public function model(array $row): Model|array|null
    {
        $categoriaId = $this->obtenerCategoriaId($row);
        $unidadId = $this->obtenerUnidadId($row);
        
        $productoExistente = $this->obtenerProductoExistente($row);
        $stockAnterior = $productoExistente ? (float)$productoExistente->stock : 0;
        $stockNuevo = isset($row['stock']) && is_numeric($row['stock']) ? (float)$row['stock'] : 0;

        $producto = $this->guardarProducto($row, $categoriaId, $unidadId, $stockNuevo);

        $this->registrarHistorial($producto, $stockAnterior, $stockNuevo, $productoExistente);

        return $producto;
    }

    public function rules(): array
    {
        return [
            'nombre'           => ['required', 'string', 'max:255'],
            'precio_venta'     => ['required', 'numeric', 'min:0'],
            'precio_compra'    => ['nullable', 'numeric', 'min:0'],
            'precio_mayoreo'   => ['nullable', 'numeric', 'min:0'],
            'stock'            => ['nullable', 'numeric', 'min:0'],
            'stock_minimo'     => ['nullable', 'numeric', 'min:0'],
            'codigo_barras'    => ['nullable'],
            'categoria'        => ['nullable', 'string', 'max:255'],
            'unidad'           => ['nullable', 'string', 'max:255'],
            'disponible_venta' => ['nullable'],
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'nombre.required'        => 'El nombre del producto es obligatorio.',
            'nombre.string'          => 'El nombre del producto debe ser texto.',
            'nombre.max'             => 'El nombre no debe superar los 255 caracteres.',
            'precio_venta.required'  => 'El precio de venta es obligatorio.',
            'precio_venta.numeric'   => 'El precio de venta debe ser un número válido.',
            'precio_venta.min'       => 'El precio de venta no puede ser negativo.',
            'precio_compra.numeric'  => 'El precio de compra debe ser un número válido.',
            'precio_compra.min'      => 'El precio de compra no puede ser negativo.',
            'precio_mayoreo.numeric' => 'El precio de mayoreo debe ser un número válido.',
            'precio_mayoreo.min'     => 'El precio de mayoreo no puede ser negativo.',
            'stock.numeric'          => 'El stock debe ser un número válido.',
            'stock.min'              => 'El stock no puede ser negativo.',
            'stock_minimo.numeric'   => 'El stock mínimo debe ser un número válido.',
            'stock_minimo.min'       => 'El stock mínimo no puede ser negativo.',
        ];
    }

    public function customValidationAttributes(): array
    {
        return [
            'nombre'         => 'nombre',
            'precio_venta'   => 'precio de venta',
            'precio_compra'  => 'precio de compra',
            'precio_mayoreo' => 'precio de mayoreo',
            'stock'          => 'stock',
            'stock_minimo'   => 'stock mínimo',
            'codigo_barras'  => 'código de barras',
            'categoria'      => 'categoría',
            'unidad'         => 'unidad',
        ];
    }

    private function obtenerCategoriaId(array $row): ?int
    {
        if (!empty($row['categoria'])) {
            return Categoria::firstOrCreate(['nombre' => $row['categoria']])->id;
        }
        return $row['categoria_id'] ?? null;
    }

    private function obtenerUnidadId(array $row): int
    {
        if (!empty($row['unidad'])) {
            $unidad = Unidad::where('nombre', $row['unidad'])->first();
            if ($unidad) {
                return $unidad->id;
            }
        }
        return $row['unidad_id'] ?? 1;
    }

    private function obtenerProductoExistente(array $row): ?Producto
    {
        $query = Producto::query();
        if (!empty($row['codigo_barras'])) {
            $query->where('codigo_barras', $row['codigo_barras']);
        } else {
            $query->where('nombre', $row['nombre']);
        }
        return $query->first();
    }

    private function guardarProducto(array $row, ?int $categoriaId, int $unidadId, float|int $stockNuevo): Producto
    {
        $matchAtributos = !empty($row['codigo_barras']) 
            ? ['codigo_barras' => $row['codigo_barras']] 
            : ['nombre' => $row['nombre']];

        $producto = Producto::updateOrCreate(
            $matchAtributos,
            [
                'nombre'           => $row['nombre'],
                'descripcion'      => $row['descripcion'] ?? null,
                'precio_compra'    => $row['precio_compra'] ?? 0,
                'precio_venta'     => $row['precio_venta'] ?? 0,
                'precio_mayoreo'   => $row['precio_mayoreo'] ?? 0,
                'stock'            => $stockNuevo,
                'stock_minimo'     => $row['stock_minimo'] ?? 0,
                'categoria_id'     => $categoriaId,
                'unidad_id'        => $unidadId,
                'disponible_venta' => isset($row['disponible_venta']) ? (bool)$row['disponible_venta'] : true,
            ]
        );

        if (blank($producto->codigo_barras)) {
            $producto->update(['codigo_barras' => app(CodigoBarrasService::class)->generar($producto->id)]);
        }

        return $producto;
    }

    private function registrarHistorial(Producto $producto, float|int $stockAnterior, float|int $stockNuevo, ?Producto $productoExistente): void
    {
        if (!$productoExistente || $stockAnterior != $stockNuevo) {
            $operacion = $stockNuevo >= $stockAnterior ? '+' : '-';
            $nombreUsuario = User::find($this->userId)?->name ?? 'Sistema';

            HistorialMovimiento::create([
                'producto_id'        => $producto->id,
                'user_id'            => $this->userId,
                'tipo_movimiento_id' => TipoMovimientoEnum::IMPORTACION->value,
                'operacion'          => $operacion,
                'cantidad'           => abs($stockNuevo - $stockAnterior),
                'stock_anterior'     => $stockAnterior,
                'stock_actual'       => $stockNuevo,
                'observacion'        => 'Importación masiva desde Excel ingresado por el usuario: ' . $nombreUsuario,
            ]);
        }
    }
}
