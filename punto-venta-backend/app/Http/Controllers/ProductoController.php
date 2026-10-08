<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductoRequest;
use App\Services\ProductoService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductoExport;
use App\Imports\ProductoImport;

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

    public function show(int $id)
    {
        $producto = $this->productoService->obtenerPorId($id);
        return response()->json($producto);
    }

    public function update(ProductoRequest $request, int $id)
    {
        $producto = $this->productoService->actualizarProducto( $id, $request->validated(), $request->file('imagen'));
        return response()->json($producto);
    }

    public function destroy(int $id)
    {
        $this->productoService->eliminarProducto($id);
        return response()->json(null, 204);
    }

    public function exportar()
    {
        return Excel::download(new ProductoExport, 'productos.xlsx');
    }

    public function importar(Request $request)
    {
        $request->validate([
            'archivo_excel' => 'required|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new ProductoImport(auth()->id()), $request->file('archivo_excel'));

        return response()->json(['mensaje' => 'Productos importados correctamente']);
    }
}
