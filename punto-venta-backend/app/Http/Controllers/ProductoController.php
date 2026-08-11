<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductoRequest;
use App\Services\ProductoService;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function __construct(protected ProductoService $productoService) {}

    public function index(Request $request)
    {
        $productos = $this->productoService->listarProductos($request);
        return response()->json($productos);
    }

    public function listarSelect(Request $request)
    {
        $productos = $this->productoService->listarSelectProducto($request->query('search'));
        return response()->json($productos);
    }

    public function store(ProductoRequest $request)
    {
        $producto = $this->productoService->crearProducto(
            $request->validated(),
            $request->file('imagen')
        );
        return response()->json($producto, 201);
    }

    public function show(string $id)
    {
        $producto = $this->productoService->obtenerPorId($id);
        return response()->json($producto);
    }

    public function update(ProductoRequest $request, string $id)
    {
        $producto = $this->productoService->actualizarProducto( $id, $request->validated(), $request->file('imagen'));
        return response()->json($producto);
    }

    public function destroy(string $id)
    {
        $this->productoService->eliminarProducto($id);
        return response()->json(null, 204);
    }
}
