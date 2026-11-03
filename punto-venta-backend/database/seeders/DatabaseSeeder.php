<?php

namespace Database\Seeders;

use App\Enums\TipoComprobanteEnum;
use App\Enums\TipoMetodoPagoEnum;
use App\Enums\TipoMovimientoEnum;
use App\Models\Empresa;
use App\Models\MetodoPago;
use App\Models\Rol;
use App\Models\TipoComprobante;
use App\Models\TipoMovimiento;
use App\Models\Unidad;
use App\Models\User;
use App\Services\ClienteService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    private const UNIDADES = [
        ['nombre' => 'Unidad', 'abreviatura' => 'Und', 'permite_decimales' => false],
        ['nombre' => 'Granel', 'abreviatura' => 'Gln', 'permite_decimales' => true],
        ['nombre' => 'Kilogramo', 'abreviatura' => 'Kg', 'permite_decimales' => true],
        ['nombre' => 'Caja', 'abreviatura' => 'Cja', 'permite_decimales' => false],
        ['nombre' => 'Docena', 'abreviatura' => 'Dzn', 'permite_decimales' => false],
    ];

    private const METODOS_PAGO = [
        ['nombre' => 'Efectivo', 'es_sistema' => true, 'tipo' => TipoMetodoPagoEnum::EFECTIVO->value],
        ['nombre' => 'Tarjeta', 'es_sistema' => false, 'tipo' => TipoMetodoPagoEnum::TARJETA->value],
        ['nombre' => 'Transferencia', 'es_sistema' => false, 'tipo' => TipoMetodoPagoEnum::TRANSFERENCIA->value],
    ];

    private const TIPOS_COMPROBANTE = [
        ['codigo_sunat' => TipoComprobanteEnum::FACTURA->value, 'nombre' => 'FACTURA ELECTRÓNICA', 'serie' => 'F001', 'activo' => false],
        ['codigo_sunat' => TipoComprobanteEnum::BOLETA->value, 'nombre' => 'BOLETA DE VENTA ELECTRÓNICA', 'serie' => 'B001', 'activo' => false],
        ['codigo_sunat' => TipoComprobanteEnum::TICKET->value, 'nombre' => 'TICKET DE VENTA', 'serie' => 'T001', 'activo' => true],
        ['codigo_sunat' => TipoComprobanteEnum::ORDEN_COMPRA->value, 'nombre' => 'ORDEN DE COMPRA', 'serie' => 'OC01', 'activo' => true],
        ['codigo_sunat' => TipoComprobanteEnum::COTIZACION->value, 'nombre' => 'COTIZACIÓN', 'serie' => 'CT01', 'activo' => true],
        ['codigo_sunat' => TipoComprobanteEnum::AJUSTE_INVENTARIO->value, 'nombre' => 'AJUSTE DE INVENTARIO', 'serie' => 'AJ01', 'activo' => true],
    ];

    private const TIPOS_MOVIMIENTO = [
        TipoMovimientoEnum::RECIBIR_ARTICULOS->value => 'RECIBIR ARTÍCULOS',
        TipoMovimientoEnum::RECUENTO_INVENTARIO->value => 'RECUENTO DE INVENTARIO',
        TipoMovimientoEnum::PERDIDA->value => 'PERDIDA',
        TipoMovimientoEnum::DANO->value => 'DAÑO',
        TipoMovimientoEnum::ARTICULO_EDITADO->value => 'ARTICULO EDITADO',
        TipoMovimientoEnum::IMPORTACION->value => 'IMPORTACION',
        TipoMovimientoEnum::VENTA->value => 'VENTA',
        TipoMovimientoEnum::COMPRA->value => 'COMPRA',
        TipoMovimientoEnum::DEVOLUCION->value => 'DEVOLUCION',
        TipoMovimientoEnum::ANULACION_VENTA->value => 'ANULACIÓN DE VENTA',
        TipoMovimientoEnum::ARTICULO_CREADO->value => 'ARTICULO CREADO',
    ];

    public function run(): void
    {
        $this->call(RolesPermisosSeeder::class);

        $this->crearDueno();
        $this->crearEmpresa();
        $this->crearUnidades();
        $this->crearMetodosPago();
        $this->crearTiposComprobante();
        $this->crearTiposMovimiento();

        app(ClienteService::class)->obtenerOCrearClientePorDefecto();
    }

    private function crearDueno(): void
    {
        if (User::where('is_admin', true)->exists()) {
            return;
        }

        User::forceCreate([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => '123456789',
            'is_admin' => true,
        ])->assignRole(Rol::ADMINISTRADOR);
    }

    private function crearEmpresa(): void
    {
        if (Empresa::exists()) {
            return;
        }

        Empresa::create([
            'nombre' => 'Mi Empresa POS',
            'ruc' => '12345678901',
            'telefono' => '987654321',
            'email' => 'contacto@miempresa.com',
            'direccion' => 'Calle Principal 123, Ciudad',
            'moneda_simbolo' => 'S/',
            'timezone' => "America/Lima"
        ]);
    }

    private function crearUnidades(): void
    {
        if (Unidad::exists()) {
            return;
        }

        foreach (self::UNIDADES as $unidad) {
            Unidad::create($unidad);
        }
    }

    private function crearMetodosPago(): void
    {
        if (MetodoPago::exists()) {
            return;
        }

        foreach (self::METODOS_PAGO as $metodo) {
            MetodoPago::create($metodo);
        }
    }

    private function crearTiposComprobante(): void
    {
        foreach (self::TIPOS_COMPROBANTE as $tipo) {
            TipoComprobante::firstOrCreate(
                ['codigo_sunat' => $tipo['codigo_sunat']],
                [...$tipo, 'correlativo' => '0']
            );
        }
    }

    private function crearTiposMovimiento(): void
    {
        foreach (self::TIPOS_MOVIMIENTO as $id => $nombre) {
            TipoMovimiento::firstOrCreate(['id' => $id], ['nombre' => $nombre]);
        }
    }
}
