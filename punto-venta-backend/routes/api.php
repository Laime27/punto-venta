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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('auth/login', [AuthController::class, 'login']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('categoria/listar-select', [CategoriaController::class, 'listarSelect']);
    Route::apiResource('categoria', CategoriaController::class);

    Route::get('producto/listar-select', [ProductoController::class, 'listarSelect']);
    Route::apiResource('producto', ProductoController::class);

    Route::get('unidad', [UnidadController::class, 'index']);

    Route::get('proveedor/listar-select', [ProveedorController::class, 'listarSelect']);
    Route::apiResource('proveedor', ProveedorController::class);

    Route::get('cliente/listar-select', [ClienteController::class, 'listarSelect']);
    Route::apiResource('cliente', ClienteController::class);

    Route::get('metodo-pago/listar-todos', [MetodoPagoController::class, 'listarTodos']);
    Route::apiResource('metodo-pago', MetodoPagoController::class);
});
