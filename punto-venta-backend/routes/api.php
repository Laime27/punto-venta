<?php

use Illuminate\Http\Request;
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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('auth/login', [AuthController::class, 'login']);

Route::get('producto/plantilla', [ProductoController::class, 'descargarPlantilla']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::get('categoria/listar-select', [CategoriaController::class, 'listarSelect']);
    Route::apiResource('categoria', CategoriaController::class);

    Route::get('producto/listar-select', [ProductoController::class, 'listarSelect']);
    Route::get('producto/exportar', [ProductoController::class, 'exportar']);
    Route::post('producto/importar', [ProductoController::class, 'importar']);
    Route::apiResource('producto', ProductoController::class);

    Route::get('unidad', [UnidadController::class, 'index']);

    Route::get('proveedor/listar-select', [ProveedorController::class, 'listarSelect']);
    Route::apiResource('proveedor', ProveedorController::class);

    Route::get('cliente/listar-select', [ClienteController::class, 'listarSelect']);
    Route::apiResource('cliente', ClienteController::class);

    Route::get('metodo-pago/listar-todos', [MetodoPagoController::class, 'listarTodos']);
    Route::patch('metodo-pago/{id}/estado', [MetodoPagoController::class, 'cambiarEstado']);
    Route::apiResource('metodo-pago', MetodoPagoController::class)->except(['destroy']);

    Route::get('comprobante', [ComprobanteController::class, 'index']);
    Route::get('comprobante/{id}/ticket', [ComprobanteController::class, 'ticket']);
    Route::get('comprobante/{id}', [ComprobanteController::class, 'show']);
    Route::post('comprobante/registrar-venta', [ComprobanteController::class, 'registrarVenta']);
    Route::post('comprobante/{id}/anular', [ComprobanteController::class, 'anular']);
    Route::post('comprobante/credito/{id}/abonar', [ComprobanteController::class, 'abonarCredito']);
    
    Route::get('historial-movimiento', [HistorialMovimientoController::class, 'index']);
    
    Route::post('orden-compra/{id}/recibir', [OrdenCompraController::class, 'recibir']);
    Route::apiResource('orden-compra', OrdenCompraController::class);

    Route::patch('cotizacion/{id}/estado', [CotizacionController::class, 'cambiarEstado']);
    Route::get('cotizacion/{id}/pdf', [CotizacionController::class, 'generarPdf']);
    Route::get('cotizacion/{id}/para-venta', [CotizacionController::class, 'paraVenta']);
    Route::apiResource('cotizacion', CotizacionController::class);

    Route::get('caja', [CajaController::class, 'index']);
    Route::get('caja/estado-actual', [CajaController::class, 'estadoActual']);
    Route::post('caja/abrir', [CajaController::class, 'abrir']);
    Route::post('caja/{id}/cerrar', [CajaController::class, 'cerrar']);
    Route::get('caja/{id}/resumen', [CajaController::class, 'resumen']);
    Route::post('caja/movimientos', [CajaController::class, 'registrarMovimiento']);
    Route::get('caja/{id}/movimientos', [CajaController::class, 'listarMovimientos']);
    Route::get('caja/{id}', [CajaController::class, 'show']);

    Route::get('empresa/zonas-horarias', [EmpresaController::class, 'zonasHorarias']);
    Route::get('empresa', [EmpresaController::class, 'show']);
    Route::post('empresa', [EmpresaController::class, 'update']);

    Route::get('impresora/ticket-prueba',[ImpresoraController::class, 'ticketPrueba']);
    Route::get('impresora', [ImpresoraController::class, 'show']);
    Route::post('impresora', [ImpresoraController::class, 'update']);




    
});
