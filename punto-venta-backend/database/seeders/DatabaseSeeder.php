<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categoria;
use Database\Factories\CategoriaFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Unidad;
use App\Models\Proveedor;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Empresa;
use App\Models\MetodoPago;
use Database\Factories\ProveedorFactory;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {

        if (! User::where('email', 'admin@gmail.com')->exists()) {
            User::factory()->create([
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password'=> bcrypt('123456789'),
            ]);
        }

        if (Empresa::count() === 0) {
            Empresa::create(
                [
                    'nombre' => 'Mi Empresa POS',
                    'ruc' => '12345678901',
                    'telefono' => '987654321',
                    'email' => 'contacto@miempresa.com',
                    'direccion' => 'Calle Principal 123, Ciudad',
                    'moneda_simbolo' => 'S/',
                ]
            );
        }

        $unidades = [
            ['nombre' => 'Unidad', 'abreviatura' => 'Und', 'permite_decimales' => false],
            ['nombre' => 'Granel', 'abreviatura' => 'Gln', 'permite_decimales' => true],
            ['nombre' => 'Kilogramo', 'abreviatura' => 'Kg', 'permite_decimales' => true],
            ['nombre' => 'Caja', 'abreviatura' => 'Cja', 'permite_decimales' => false],
            ['nombre' => 'Docena', 'abreviatura' => 'Dzn', 'permite_decimales' => false],
        ];
        if (Unidad::count() === 0) {
            foreach ($unidades as $unidad) {
                Unidad::create($unidad);
            }
        }

        $metodos = [
            ['nombre' => 'Efectivo', 'es_sistema' => true, 'tipo' => 'efectivo'],
            ['nombre' => 'Tarjeta', 'es_sistema' => false, 'tipo' => 'tarjeta'],
            ['nombre' => 'Transferencia', 'es_sistema' => false, 'tipo' => 'transferencia'],
        ];
        if (MetodoPago::count() === 0) {
            foreach ($metodos as $metodo) {
                MetodoPago::create($metodo);
            }
        }

        $tipos = [
            [
                'nombre' => 'FACTURA ELECTRÓNICA',
                'codigo_sunat' => '01',
                'serie' => 'F001',
                'correlativo' => '0',
                'activo' => false,
            ],
            [
                'nombre' => 'BOLETA DE VENTA ELECTRÓNICA',
                'codigo_sunat' => '03',
                'serie' => 'B001',
                'correlativo' => '0',
                'activo' => false,
            ],
            [
                'nombre' => 'TICKET DE VENTA',
                'codigo_sunat' => '00',
                'serie' => 'T001',
                'correlativo' => '0',
                'activo' => true,
            ],
            [
                'nombre' => 'ORDEN DE COMPRA',
                'codigo_sunat' => 'OC',
                'serie' => 'OC01',
                'correlativo' => '0',
                'activo' => true,
            ],
            [
                'nombre' => 'COTIZACIÓN',
                'codigo_sunat' => 'CT',
                'serie' => 'CT01',
                'correlativo' => '0',
                'activo' => true,
            ],
            [
                'nombre' => 'AJUSTE DE INVENTARIO',
                'codigo_sunat' => 'AI',
                'serie' => 'AJ01',
                'correlativo' => '0',
                'activo' => true,
            ],
            [
                'nombre' => 'AJUSTE DE INVENTARIO',
                'codigo_sunat' => 'AI',
                'serie' => 'AJ01',
                'correlativo' => '0',
                'activo' => true,
            ]
        ];

        if (DB::table('tipos_comprobantes')->count() === 0) {
            foreach ($tipos as $tipo) {
                DB::table('tipos_comprobantes')->insert($tipo);
            }
        }

        if (DB::table('tipos_movimientos')->count() === 0) {
            DB::table('tipos_movimientos')->insert([
                ['nombre' => 'RECIBIR ARTÍCULOS'],
                ['nombre' => 'RECUENTO DE INVENTARIO'],
                ['nombre' => 'PERDIDA'],
                ['nombre' => 'DAÑO'],
                ['nombre' => 'ARTICULO EDITADO'],
                ['nombre' => 'IMPORTACION'],
                ['nombre' => 'VENTA'],
                ['nombre' => 'COMPRA'],
                ['nombre' => 'DEVOLUCION'],
                ['nombre' => 'ANULACIÓN DE VENTA'],
                ['nombre' => 'ARTICULO CREADO'],
            ]);
        }

        // $this->call([
        //     DummyDataSeeder::class,
        // ]);
    }
}