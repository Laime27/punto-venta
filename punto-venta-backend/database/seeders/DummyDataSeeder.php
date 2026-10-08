<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Categoria;
use App\Models\Proveedor;
use Faker\Factory as Faker;

class DummyDataSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('es_ES');

        // 1. Categorias y Proveedores
        $this->command->info('Generando Categorías y Proveedores...');
        if (Categoria::count() === 0) {
            \App\Models\Categoria::factory(50)->create();
        }
        if (Proveedor::count() === 0) {
            \App\Models\Proveedor::factory(50)->create();
        }

        $categorias = DB::table('categorias')->pluck('id')->toArray();
        $proveedores = DB::table('proveedores')->pluck('id')->toArray();

        // 2. Unidades
        $unidadIds = DB::table('unidades')->pluck('id')->toArray();

        $ahora = now();

        // 3. Productos (1000)
        $this->command->info('Generando 1000 Productos (puede tomar unos segundos)...');
        $productos = [];
        for ($i = 1; $i <= 1000; $i++) {
            $precio_compra = $faker->randomFloat(2, 5, 500);
            $productos[] = [
                'nombre' => 'Producto ' . $i . ' ' . $faker->words(2, true),
                'descripcion' => $faker->sentence(),
                'precio_compra' => $precio_compra,
                'precio_venta' => $precio_compra * 1.5,
                'precio_mayoreo' => $precio_compra * 1.2,
                'stock' => $faker->randomFloat(2, 0, 1000),
                'stock_minimo' => 5,
                'codigo_barras' => $faker->unique()->ean13(),
                'categoria_id' => $faker->randomElement($categorias),
                'unidad_id' => $faker->randomElement($unidadIds),
                'disponible_venta' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }
        foreach (array_chunk($productos, 500) as $chunk) {
            DB::table('productos')->insert($chunk);
        }
        $productoIds = DB::table('productos')->pluck('id')->toArray();

        // 4. Clientes (1000)
        $this->command->info('Generando 1000 Clientes...');
        $clientes = [];
        for ($i = 1; $i <= 1000; $i++) {
            $clientes[] = [
                'nombre' => $faker->name,
                'correo' => $faker->unique()->safeEmail,
                'telefono' => $faker->phoneNumber,
                'direccion' => $faker->address,
                'es_sistema' => false,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }
        foreach (array_chunk($clientes, 500) as $chunk) {
            DB::table('clientes')->insert($chunk);
        }
        $clienteIds = DB::table('clientes')->pluck('id')->toArray();

        // Obtenemos FKs iniciales para los documentos
        $userId = DB::table('users')->first()->id ?? 1;
        
        $cajaId = DB::table('cajas')->first()->id ?? null;
        if (!$cajaId) {
            $cajaId = DB::table('cajas')->insertGetId([
                'abierto_por' => $userId,
                'fecha_apertura' => now(),
                'monto_apertura' => 0,
                'estado' => 'abierta',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $metodoPagoId = DB::table('metodos_pagos')->first()->id ?? 1;

        // 5. Comprobantes (Ventas)
        $this->command->info('Generando 1000 Comprobantes (Ventas)...');
        $tipoBoleta = DB::table('tipos_comprobantes')->where('codigo_sunat', '03')->first()->id ?? 2;
        $comprobantes = [];
        $comprobanteDetalles = [];
        for ($i = 1; $i <= 1000; $i++) {
            $total = $faker->randomFloat(2, 20, 2000);
            $fecha = $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s');
            $comprobantes[] = [
                'codigo_venta' => 'VNT-' . str_pad($i, 8, '0', STR_PAD_LEFT),
                'tipo_comprobante_id' => $tipoBoleta,
                'cliente_id' => $faker->randomElement($clienteIds),
                'user_id' => $userId,
                'caja_id' => $cajaId,
                'serie' => 'B001',
                'correlativo' => str_pad($i, 6, '0', STR_PAD_LEFT),
                'subtotal' => $total / 1.18,
                'impuesto' => $total - ($total / 1.18),
                'descuento' => 0,
                'total' => $total,
                'estado' => 'pagado',
                'created_at' => $fecha,
                'updated_at' => $fecha,
            ];
        }
        foreach (array_chunk($comprobantes, 500) as $chunk) {
            DB::table('comprobantes')->insert($chunk);
        }
        $comprobanteIds = DB::table('comprobantes')->orderBy('id', 'desc')->take(1000)->pluck('id')->toArray();
        foreach ($comprobanteIds as $compId) {
            $numItems = rand(1, 4);
            for ($k = 0; $k < $numItems; $k++) {
                $cant = rand(1, 5);
                $precio = rand(10, 100);
                $comprobanteDetalles[] = [
                    'comprobante_id' => $compId,
                    'producto_id' => $faker->randomElement($productoIds),
                    'cantidad' => $cant,
                    'precio_unitario' => $precio,
                    'subtotal' => $cant * $precio,
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ];
            }
        }
        foreach (array_chunk($comprobanteDetalles, 500) as $chunk) {
            DB::table('comprobante_detalles')->insert($chunk);
        }

        $comprobantePagos = [];
        foreach ($comprobanteIds as $compId) {
            $comprobantePagos[] = [
                'comprobante_id' => $compId,
                'metodo_pago_id' => $metodoPagoId,
                'monto' => $faker->randomFloat(2, 20, 2000),
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }
        foreach (array_chunk($comprobantePagos, 500) as $chunk) {
            DB::table('comprobante_pagos')->insert($chunk);
        }

        // 6. Ordenes de Compra
        $this->command->info('Generando 500 Ordenes de Compra...');
        $ordenes = [];
        $ordenesDetalles = [];
        $tipoOC = DB::table('tipos_comprobantes')->where('codigo_sunat', 'OC')->first()->id ?? null;
        if ($tipoOC) {
            for ($i = 1; $i <= 500; $i++) {
                $ordenes[] = [
                    'proveedor_id' => $faker->randomElement($proveedores),
                    'user_id' => $userId,
                    'serie_id' => $tipoOC,
                    'serie' => 'OC01',
                    'correlativo' => str_pad($i, 6, '0', STR_PAD_LEFT),
                    'fecha_emision' => $faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d H:i:s'),
                    'estado' => $faker->randomElement(['PENDIENTE', 'RECIBIDA_COMPLETA']),
                    'total_estimado' => rand(100, 5000),
                    'total_real' => rand(100, 5000),
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ];
            }
            foreach (array_chunk($ordenes, 250) as $chunk) {
                DB::table('orden_compras')->insert($chunk);
            }
            $ocIds = DB::table('orden_compras')->orderBy('id', 'desc')->take(500)->pluck('id')->toArray();
            foreach ($ocIds as $ocId) {
                $numItems = rand(1, 3);
                for ($k = 0; $k < $numItems; $k++) {
                    $cant = rand(10, 50);
                    $precio = rand(10, 100);
                    $ordenesDetalles[] = [
                        'orden_compra_id' => $ocId,
                        'producto_id' => $faker->randomElement($productoIds),
                        'cantidad_pedida' => $cant,
                        'cantidad_recibida' => rand(0, $cant),
                        'precio_unitario' => $precio,
                        'subtotal' => $cant * $precio,
                        'created_at' => $ahora,
                        'updated_at' => $ahora,
                    ];
                }
            }
            foreach (array_chunk($ordenesDetalles, 500) as $chunk) {
                DB::table('orden_compra_detalles')->insert($chunk);
            }
        }

        // 7. Cotizaciones
        $this->command->info('Generando 500 Cotizaciones...');
        $cotizaciones = [];
        $cotizacionesDetalles = [];
        $tipoCT = DB::table('tipos_comprobantes')->where('codigo_sunat', 'CT')->first()->id ?? null;
        if ($tipoCT) {
            for ($i = 1; $i <= 500; $i++) {
                $subtotal = rand(100, 1000);
                $impuesto = $subtotal * 0.18;
                $fechaEmi = $faker->dateTimeBetween('-3 months', 'now');
                $fechaVen = clone $fechaEmi;
                $fechaVen->modify('+15 days');
                
                $cotizaciones[] = [
                    'cliente_id' => $faker->randomElement($clienteIds),
                    'user_id' => $userId,
                    'serie_id' => $tipoCT,
                    'serie' => 'CT01',
                    'correlativo' => str_pad($i, 6, '0', STR_PAD_LEFT),
                    'fecha_emision' => $fechaEmi->format('Y-m-d H:i:s'),
                    'fecha_vencimiento' => $fechaVen->format('Y-m-d H:i:s'),
                    'estado' => $faker->randomElement(['PENDIENTE', 'ACEPTADA', 'RECHAZADA']),
                    'subtotal' => $subtotal,
                    'descuento' => 0,
                    'porcentaje_impuesto' => 18.00,
                    'monto_impuesto' => $impuesto,
                    'total' => $subtotal + $impuesto,
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ];
            }
            foreach (array_chunk($cotizaciones, 250) as $chunk) {
                DB::table('cotizaciones')->insert($chunk);
            }
            $ctIds = DB::table('cotizaciones')->orderBy('id', 'desc')->take(500)->pluck('id')->toArray();
            foreach ($ctIds as $ctId) {
                $numItems = rand(1, 3);
                for ($k = 0; $k < $numItems; $k++) {
                    $cant = rand(1, 10);
                    $precio = rand(10, 100);
                    $cotizacionesDetalles[] = [
                        'cotizacion_id' => $ctId,
                        'producto_id' => $faker->randomElement($productoIds),
                        'cantidad' => $cant,
                        'precio_unitario' => $precio,
                        'subtotal' => $cant * $precio,
                        'created_at' => $ahora,
                        'updated_at' => $ahora,
                    ];
                }
            }
            foreach (array_chunk($cotizacionesDetalles, 500) as $chunk) {
                DB::table('cotizacion_detalles')->insert($chunk);
            }
        }

        $this->command->info('¡DummyDataSeeder finalizado con éxito!');
    }
}
