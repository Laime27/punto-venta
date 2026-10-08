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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('auth/login', [AuthController::class, 'login']);

Route::group(['middleware' => 'auth:sanctum'], function () {
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

    Route::post('comprobante/registrar-venta', [ComprobanteController::class, 'registrarVenta']);
    
    Route::get('historial-movimiento', [HistorialMovimientoController::class, 'index']);
    
    Route::post('orden-compra/{id}/recibir', [OrdenCompraController::class, 'recibir']);
    Route::apiResource('orden-compra', OrdenCompraController::class);

    Route::patch('cotizacion/{id}/estado', [CotizacionController::class, 'cambiarEstado']);
    Route::get('cotizacion/{id}/pdf', [CotizacionController::class, 'generarPdf']);
    Route::apiResource('cotizacion', CotizacionController::class);
});
