<?php

namespace App\Imports;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Unidad;
use App\Models\HistorialMovimiento;
use App\Models\User;
use App\Enums\TipoMovimientoEnum;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ProductoImport implements ToModel, WithHeadingRow
{
    protected $userId;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    public function model(array $row): Model|array|null
    {
        if (!isset($row['nombre']) || !isset($row['precio_venta'])) {
            return null;
        }

        $categoriaId = $this->obtenerCategoriaId($row);
        $unidadId = $this->obtenerUnidadId($row);
        
        $productoExistente = $this->obtenerProductoExistente($row);
        $stockAnterior = $productoExistente ? $productoExistente->stock : 0;
        $stockNuevo = $row['stock'] ?? 0;

        $producto = $this->guardarProducto($row, $categoriaId, $unidadId, $stockNuevo);

        $this->registrarHistorial($producto, $stockAnterior, $stockNuevo, $productoExistente);

        return $producto;
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

    private function guardarProducto(array $row, ?int $categoriaId, int $unidadId, int $stockNuevo): Producto
    {
        $matchAtributos = !empty($row['codigo_barras']) 
            ? ['codigo_barras' => $row['codigo_barras']] 
            : ['nombre' => $row['nombre']];

        return Producto::updateOrCreate(
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
    }

    private function registrarHistorial(Producto $producto, int $stockAnterior, int $stockNuevo, ?Producto $productoExistente): void
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
