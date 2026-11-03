<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\UnidadController;
use App\Http\Controllers\MetodoPagoController;
use App\Http\Controllers\ComprobanteController;
use App\Http\Controllers\HistorialMovimientoController;
use App\Http\Controllers\OrdenCompraController;
use App\Http\Controllers\CotizacionController;
use App\Http\Controllers\CajaController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\ImpresoraController;
use App\Http\Controllers\AjusteInventarioController;
use App\Http\Controllers\KardexController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RespaldoController;
use App\Http\Controllers\NotificacionController;
use App\Enums\ReporteEnum;
use App\Models\Rol;

Route::post('auth/login', [AuthController::class, 'login']);

Route::get('producto/plantilla', [ProductoController::class, 'descargarPlantilla']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::get('dashboard', [DashboardController::class, 'index'])->role(Rol::ADMINISTRADOR);
    Route::get('respaldo/descargar', [RespaldoController::class, 'descargar'])->role(Rol::ADMINISTRADOR);

    Route::get('notificacion', [NotificacionController::class, 'index']);
    Route::post('notificacion/leer-todas', [NotificacionController::class, 'leerTodas']);
    Route::patch('notificacion/{id}/leer', [NotificacionController::class, 'leer']);
    Route::delete('notificacion/{id}', [NotificacionController::class, 'destroy']);

    Route::get('categoria/listar-select', [CategoriaController::class, 'listarSelect']);
    Route::get('producto/listar-select', [ProductoController::class, 'listarSelect']);
    Route::get('cliente/listar-select', [ClienteController::class, 'listarSelect']);
    Route::get('proveedor/listar-select', [ProveedorController::class, 'listarSelect']);
    Route::get('metodo-pago/listar-todos', [MetodoPagoController::class, 'listarTodos']);
    Route::get('unidad', [UnidadController::class, 'index']);
    Route::get('caja/estado-actual', [CajaController::class, 'estadoActual']);
    Route::get('empresa', [EmpresaController::class, 'show']);
    Route::get('impresora', [ImpresoraController::class, 'show']);

    Route::get('categoria', [CategoriaController::class, 'index'])->permission('categoria.ver');
    Route::get('categoria/{id}', [CategoriaController::class, 'show'])->permission('categoria.ver');
    Route::post('categoria', [CategoriaController::class, 'store'])->permission('categoria.crear');
    Route::put('categoria/{id}', [CategoriaController::class, 'update'])->permission('categoria.editar');
    Route::delete('categoria/{id}', [CategoriaController::class, 'destroy'])->permission('categoria.eliminar');

    Route::get('producto/generar-codigo', [ProductoController::class, 'generarCodigo'])->permission(['producto.crear', 'producto.editar']);
    Route::get('producto/exportar', [ProductoController::class, 'exportar'])->permission('producto.exportar');
    Route::post('producto/importar', [ProductoController::class, 'importar'])->permission('producto.importar');
    Route::post('producto/importar-filas', [ProductoController::class, 'importarFilas'])->permission('producto.importar');
    Route::get('producto/{id}/kardex', [KardexController::class, 'show'])->permission('inventario.movimientos');
    Route::get('producto/{id}/kardex/exportar', [KardexController::class, 'exportar'])->permission('inventario.movimientos');
    Route::get('producto', [ProductoController::class, 'index'])->permission('producto.ver');
    Route::get('producto/{producto}', [ProductoController::class, 'show'])->permission(['producto.ver', 'producto.editar']);
    Route::post('producto', [ProductoController::class, 'store'])->permission('producto.crear');
    Route::put('producto/{producto}', [ProductoController::class, 'update'])->permission('producto.editar');
    Route::delete('producto/{producto}', [ProductoController::class, 'destroy'])->permission('producto.eliminar');

    Route::get('proveedor', [ProveedorController::class, 'index'])->permission('proveedor.ver');
    Route::get('proveedor/{proveedor}', [ProveedorController::class, 'show'])->permission('proveedor.ver');
    Route::post('proveedor', [ProveedorController::class, 'store'])->permission('proveedor.crear');
    Route::put('proveedor/{proveedor}', [ProveedorController::class, 'update'])->permission('proveedor.editar');
    Route::delete('proveedor/{proveedor}', [ProveedorController::class, 'destroy'])->permission('proveedor.eliminar');

    Route::get('cliente', [ClienteController::class, 'index'])->permission('cliente.ver');
    Route::get('cliente/{cliente}', [ClienteController::class, 'show'])->permission('cliente.ver');
    Route::post('cliente', [ClienteController::class, 'store'])->permission(['cliente.crear', 'venta.registrar']);
    Route::put('cliente/{cliente}', [ClienteController::class, 'update'])->permission('cliente.editar');
    Route::delete('cliente/{cliente}', [ClienteController::class, 'destroy'])->permission('cliente.eliminar');

    Route::get('metodo-pago', [MetodoPagoController::class, 'index'])->permission('configuracion.metodos_pago');
    Route::get('metodo-pago/{id}', [MetodoPagoController::class, 'show'])->permission('configuracion.metodos_pago');
    Route::post('metodo-pago', [MetodoPagoController::class, 'store'])->permission('configuracion.metodos_pago');
    Route::put('metodo-pago/{id}', [MetodoPagoController::class, 'update'])->permission('configuracion.metodos_pago');
    Route::patch('metodo-pago/{id}/estado', [MetodoPagoController::class, 'cambiarEstado'])->permission('configuracion.metodos_pago');

    Route::post('comprobante/registrar-venta', [ComprobanteController::class, 'registrarVenta'])->permission('venta.registrar');
    Route::get('comprobante', [ComprobanteController::class, 'index'])->permission('comprobante.ver');
    Route::get('comprobante/{id}', [ComprobanteController::class, 'show'])->permission('comprobante.ver');
    Route::get('comprobante/{id}/ticket', [ComprobanteController::class, 'ticket'])->permission(['comprobante.imprimir', 'venta.registrar']);
    Route::post('comprobante/{id}/anular', [ComprobanteController::class, 'anular'])->permission('comprobante.anular');
    Route::post('comprobante/credito/{id}/abonar', [ComprobanteController::class, 'abonarCredito'])->permission('comprobante.abonar');

    Route::get('historial-movimiento/tipos', [HistorialMovimientoController::class, 'tipos'])->permission('inventario.movimientos');
    Route::get('historial-movimiento', [HistorialMovimientoController::class, 'index'])->permission('inventario.movimientos');

    Route::get('ajuste-inventario', [AjusteInventarioController::class, 'index'])->permission('ajuste.ver');
    Route::get('ajuste-inventario/{id}', [AjusteInventarioController::class, 'show'])->permission(['ajuste.ver', 'ajuste.crear']);
    Route::post('ajuste-inventario', [AjusteInventarioController::class, 'store'])->permission('ajuste.crear');

    Route::get('orden-compra', [OrdenCompraController::class, 'index'])->permission('orden_compra.ver');
    Route::get('orden-compra/{id}', [OrdenCompraController::class, 'show'])->permission(['orden_compra.ver', 'orden_compra.editar', 'orden_compra.recibir']);
    Route::post('orden-compra', [OrdenCompraController::class, 'store'])->permission('orden_compra.crear');
    Route::put('orden-compra/{id}', [OrdenCompraController::class, 'update'])->permission('orden_compra.editar');
    Route::post('orden-compra/{id}/recibir', [OrdenCompraController::class, 'recibir'])->permission('orden_compra.recibir');
    Route::post('orden-compra/{id}/anular', [OrdenCompraController::class, 'anular'])->permission('orden_compra.editar');

    Route::get('cotizacion', [CotizacionController::class, 'index'])->permission('cotizacion.ver');
    Route::get('cotizacion/{id}', [CotizacionController::class, 'show'])->permission(['cotizacion.ver', 'cotizacion.editar']);
    Route::post('cotizacion', [CotizacionController::class, 'store'])->permission('cotizacion.crear');
    Route::put('cotizacion/{id}', [CotizacionController::class, 'update'])->permission('cotizacion.editar');
    Route::delete('cotizacion/{id}', [CotizacionController::class, 'destroy'])->permission('cotizacion.eliminar');
    Route::patch('cotizacion/{id}/estado', [CotizacionController::class, 'cambiarEstado'])->permission('cotizacion.cambiar_estado');
    Route::get('cotizacion/{id}/pdf', [CotizacionController::class, 'generarPdf'])->permission('cotizacion.pdf');
    Route::get('cotizacion/{id}/para-venta', [CotizacionController::class, 'paraVenta'])->permission('venta.desde_cotizacion');

    Route::get('caja', [CajaController::class, 'index'])->permission('caja.ver');
    Route::get('caja/{id}', [CajaController::class, 'show'])->permission('caja.ver');
    Route::get('caja/{id}/resumen', [CajaController::class, 'resumen'])->permission(['caja.ver', 'caja.cerrar']);
    Route::get('caja/{id}/movimientos', [CajaController::class, 'listarMovimientos'])->permission('caja.ver');
    Route::post('caja/abrir', [CajaController::class, 'abrir'])->permission('caja.abrir');
    Route::post('caja/{id}/cerrar', [CajaController::class, 'cerrar'])->permission('caja.cerrar');
    Route::post('caja/movimientos', [CajaController::class, 'registrarMovimiento'])->permission('caja.movimientos');

    Route::get('empresa/zonas-horarias', [EmpresaController::class, 'zonasHorarias'])->permission('configuracion.empresa');
    Route::post('empresa', [EmpresaController::class, 'update'])->permission('configuracion.empresa');

    Route::get('impresora/ticket-prueba', [ImpresoraController::class, 'ticketPrueba'])->permission('configuracion.impresora');
    Route::post('impresora', [ImpresoraController::class, 'update'])->permission('configuracion.impresora');

    Route::prefix('reporte')->group(function () {
        Route::get('vendedores', [ReporteController::class, 'vendedores'])->permission(['reporte.ventas', 'reporte.productos']);
        Route::get('{reporte}/detalle', [ReporteController::class, 'detalle'])->whereIn('reporte', ReporteEnum::valores());
        Route::get('{reporte}/exportar', [ReporteController::class, 'exportar'])->whereIn('reporte', ReporteEnum::valores());
        Route::get('{reporte}', [ReporteController::class, 'show'])->whereIn('reporte', ReporteEnum::valores());
    });

    Route::get('rol/listar-select', [RolController::class, 'listarSelect'])->permission(['usuario.crear', 'usuario.editar', 'rol.gestionar']);
    Route::get('rol/permisos', [RolController::class, 'permisos'])->permission('rol.gestionar');
    Route::get('rol', [RolController::class, 'index'])->permission('rol.gestionar');
    Route::get('rol/{rol}', [RolController::class, 'show'])->permission('rol.gestionar');
    Route::post('rol', [RolController::class, 'store'])->permission('rol.gestionar');
    Route::put('rol/{rol}', [RolController::class, 'update'])->permission('rol.gestionar');
    Route::delete('rol/{rol}', [RolController::class, 'destroy'])->permission('rol.gestionar');

    Route::get('usuario', [UsuarioController::class, 'index'])->permission('usuario.ver');
    Route::get('usuario/{usuario}', [UsuarioController::class, 'show'])->permission(['usuario.ver', 'usuario.editar']);
    Route::post('usuario', [UsuarioController::class, 'store'])->permission('usuario.crear');
    Route::put('usuario/{usuario}', [UsuarioController::class, 'update'])->permission('usuario.editar');
    Route::patch('usuario/{usuario}/estado', [UsuarioController::class, 'cambiarEstado'])->permission('usuario.desactivar');
});
