<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Unidad;
use App\Models\User;
use Illuminate\Database\Seeder;

class E2ESeeder extends Seeder
{
    public const PASSWORD = 'password123';

    private const USUARIOS = [
        ['name' => 'Carla Cajera', 'email' => 'cajero@e2e.test', 'rol' => 'Cajero', 'activo' => true],
        ['name' => 'Alan Almacén', 'email' => 'almacen@e2e.test', 'rol' => 'Almacenero', 'activo' => true],
        ['name' => 'Iván Inactivo', 'email' => 'inactivo@e2e.test', 'rol' => 'Cajero', 'activo' => false],
    ];

    public function run(): void
    {
        $this->call([RolesPermisosSeeder::class, DatabaseSeeder::class]);

        foreach (self::USUARIOS as $datos) {
            User::create([
                'name' => $datos['name'],
                'email' => $datos['email'],
                'password' => self::PASSWORD,
                'activo' => $datos['activo'],
            ])->assignRole($datos['rol']);
        }

        $categoria = Categoria::create(['nombre' => 'Bebidas']);
        $unidad = Unidad::first();

        Producto::create(['nombre' => 'Gaseosa 500ml', 'precio_compra' => 2.5, 'precio_venta' => 3.5, 'stock' => 40, 'stock_minimo' => 10, 'codigo_barras' => '7750000000011', 'categoria_id' => $categoria->id, 'unidad_id' => $unidad->id]);
        Producto::create(['nombre' => 'Agua 625ml', 'precio_compra' => 1, 'precio_venta' => 1.8, 'stock' => 4, 'stock_minimo' => 10, 'codigo_barras' => '7750000000028', 'categoria_id' => $categoria->id, 'unidad_id' => $unidad->id]);

        Producto::create(['nombre' => 'Arroz 1kg', 'precio_compra' => 3, 'precio_venta' => 4.5, 'stock' => 100, 'stock_minimo' => 10, 'codigo_barras' => '7750000000035', 'categoria_id' => $categoria->id, 'unidad_id' => $unidad->id]);
        Producto::create(['nombre' => 'Azucar 1kg', 'precio_compra' => 2, 'precio_venta' => 3, 'stock' => 20, 'stock_minimo' => 5, 'codigo_barras' => '7750000000042', 'categoria_id' => $categoria->id, 'unidad_id' => $unidad->id]);
        Producto::create(['nombre' => 'Aceite 1L', 'precio_compra' => 6, 'precio_venta' => 8, 'stock' => 30, 'stock_minimo' => 5, 'codigo_barras' => '7750000000059', 'categoria_id' => $categoria->id, 'unidad_id' => $unidad->id]);

        Cliente::create(['nombre' => 'Juan Pérez', 'telefono' => '987654321']);
    }
}
