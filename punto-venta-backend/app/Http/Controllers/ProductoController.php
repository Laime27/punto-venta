<?php

namespace App\Http\Controllers;

use App\Exports\PlantillaExport;
use App\Exports\ProductoExport;
use App\Http\Requests\ProductoRequest;
use App\Services\ProductoService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

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
        $producto = $this->productoService->actualizarProducto($id, $request->validated(), $request->file('imagen'));

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

    public function descargarPlantilla()
    {
        return Excel::download(new PlantillaExport, 'plantilla_productos.xlsx');
    }

    public function importar(Request $request)
    {
        $request->validate([
            'archivo_excel' => 'required|mimes:xlsx,xls,csv',
        ]);

        $resultado = $this->productoService->importarProductos($request->file('archivo_excel'), auth()->id());

        if (! $resultado['exito']) {
            return response()->json([
                'mensaje' => $resultado['mensaje'],
                'errores' => $resultado['errores'],
            ], 422);
        }

        return response()->json(['mensaje' => $resultado['mensaje']], 200);
    }
}
