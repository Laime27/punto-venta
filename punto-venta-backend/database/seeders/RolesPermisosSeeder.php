<?php

namespace Database\Seeders;

use App\Models\Grupo;
use App\Models\Permiso;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RolesPermisosSeeder extends Seeder
{
    private const GUARD = 'web';

    private const GRUPOS = [
        'Punto de venta' => [
            'venta.registrar' => 'Registrar ventas',
            'venta.desde_cotizacion' => 'Vender desde una cotización',
        ],
        'Caja' => [
            'caja.ver' => 'Ver cajas',
            'caja.abrir' => 'Abrir caja',
            'caja.cerrar' => 'Cerrar caja',
            'caja.movimientos' => 'Registrar ingresos y egresos',
        ],
        'Comprobantes' => [
            'comprobante.ver' => 'Ver comprobantes',
            'comprobante.imprimir' => 'Reimprimir ticket',
            'comprobante.anular' => 'Anular comprobantes',
            'comprobante.abonar' => 'Cobrar créditos',
        ],
        'Cotizaciones' => [
            'cotizacion.ver' => 'Ver cotizaciones',
            'cotizacion.crear' => 'Crear cotizaciones',
            'cotizacion.editar' => 'Editar cotizaciones',
            'cotizacion.eliminar' => 'Eliminar cotizaciones',
            'cotizacion.cambiar_estado' => 'Aceptar o rechazar cotizaciones',
            'cotizacion.pdf' => 'Descargar PDF de cotizaciones',
        ],
        'Clientes' => [
            'cliente.ver' => 'Ver clientes',
            'cliente.crear' => 'Crear clientes',
            'cliente.editar' => 'Editar clientes',
            'cliente.eliminar' => 'Eliminar clientes',
        ],
        'Productos' => [
            'producto.ver' => 'Ver productos',
            'producto.crear' => 'Crear productos',
            'producto.editar' => 'Editar productos',
            'producto.eliminar' => 'Eliminar productos',
            'producto.importar' => 'Importar productos',
            'producto.exportar' => 'Exportar productos',
            'producto.ver_costo' => 'Ver precio de compra y utilidad',
        ],
        'Categorías' => [
            'categoria.ver' => 'Ver categorías',
            'categoria.crear' => 'Crear categorías',
            'categoria.editar' => 'Editar categorías',
            'categoria.eliminar' => 'Eliminar categorías',
        ],
        'Inventario' => [
            'inventario.movimientos' => 'Ver movimientos y kardex',
            'ajuste.ver' => 'Ver ajustes de inventario',
            'ajuste.crear' => 'Registrar ajustes de inventario',
        ],
        'Compras' => [
            'orden_compra.ver' => 'Ver órdenes de compra',
            'orden_compra.crear' => 'Crear órdenes de compra',
            'orden_compra.editar' => 'Editar órdenes de compra',
            'orden_compra.recibir' => 'Recibir mercadería',
        ],
        'Proveedores' => [
            'proveedor.ver' => 'Ver proveedores',
            'proveedor.crear' => 'Crear proveedores',
            'proveedor.editar' => 'Editar proveedores',
            'proveedor.eliminar' => 'Eliminar proveedores',
        ],
        'Reportes' => [
            'reporte.ventas' => 'Reporte de ventas',
            'reporte.productos' => 'Reporte de rentabilidad de productos',
            'reporte.cuentas_por_cobrar' => 'Reporte de cuentas por cobrar',
            'reporte.inventario' => 'Reporte de inventario',
            'reporte.perdidas' => 'Reporte de pérdidas',
        ],
        'Configuración' => [
            'configuracion.empresa' => 'Datos de la empresa',
            'configuracion.metodos_pago' => 'Métodos de pago',
            'configuracion.impresora' => 'Impresora',
        ],
        'Administración' => [
            'usuario.ver' => 'Ver usuarios',
            'usuario.crear' => 'Crear usuarios',
            'usuario.editar' => 'Editar usuarios',
            'usuario.desactivar' => 'Activar o desactivar usuarios',
            'rol.gestionar' => 'Gestionar roles y permisos',
        ],
    ];

    private const ROLES = [
        'Cajero' => [
            'descripcion' => 'Ventas, caja, cobranzas y cotizaciones',
            'permisos' => [
                'venta.registrar', 'venta.desde_cotizacion',
                'caja.ver', 'caja.abrir', 'caja.cerrar', 'caja.movimientos',
                'comprobante.ver', 'comprobante.imprimir', 'comprobante.abonar',
                'cotizacion.ver', 'cotizacion.crear', 'cotizacion.editar', 'cotizacion.cambiar_estado', 'cotizacion.pdf',
                'cliente.ver', 'cliente.crear', 'cliente.editar',
                'producto.ver',
            ],
        ],
        'Almacenero' => [
            'descripcion' => 'Productos, inventario y compras',
            'permisos' => [
                'producto.ver', 'producto.crear', 'producto.editar', 'producto.importar', 'producto.exportar', 'producto.ver_costo',
                'categoria.ver', 'categoria.crear', 'categoria.editar', 'categoria.eliminar',
                'inventario.movimientos', 'ajuste.ver', 'ajuste.crear',
                'orden_compra.ver', 'orden_compra.crear', 'orden_compra.editar', 'orden_compra.recibir',
                'proveedor.ver', 'proveedor.crear', 'proveedor.editar', 'proveedor.eliminar',
                'reporte.inventario', 'reporte.perdidas',
            ],
        ],
    ];

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->crearPermisos();
        $this->crearRoles();
        $this->asignarRolesIniciales();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    private function crearPermisos(): void
    {
        $orden = 0;

        foreach (self::GRUPOS as $nombreGrupo => $permisos) {
            $grupo = Grupo::updateOrCreate(['nombre' => $nombreGrupo], ['orden' => ++$orden]);

            foreach ($permisos as $nombre => $descripcion) {
                Permiso::updateOrCreate(
                    ['name' => $nombre, 'guard_name' => self::GUARD],
                    ['grupo_id' => $grupo->id, 'descripcion' => $descripcion]
                );
            }
        }
    }

    private function crearRoles(): void
    {
        Rol::firstOrCreate(
            ['name' => Rol::ADMINISTRADOR, 'guard_name' => self::GUARD],
            ['descripcion' => 'Acceso total al sistema']
        );

        foreach (self::ROLES as $nombre => $configuracion) {
            $rol = Rol::firstOrCreate(
                ['name' => $nombre, 'guard_name' => self::GUARD],
                ['descripcion' => $configuracion['descripcion']]
            );

            if ($rol->wasRecentlyCreated) {
                $rol->syncPermissions($configuracion['permisos']);
            }
        }
    }

    private function asignarRolesIniciales(): void
    {
        $sinRol = User::doesntHave('roles')->orderBy('id')->get();

        if ($sinRol->isEmpty()) {
            return;
        }

        $hayAdministrador = User::role(Rol::ADMINISTRADOR)->exists() || $sinRol->contains('is_admin', true);
        $primerUsuarioId = User::min('id');

        $sinRol->each(function (User $usuario) use ($hayAdministrador, $primerUsuarioId) {
            $esAdministrador = $usuario->is_admin || (!$hayAdministrador && $usuario->id === $primerUsuarioId);
            $usuario->assignRole($esAdministrador ? Rol::ADMINISTRADOR : 'Cajero');
        });
    }
}
