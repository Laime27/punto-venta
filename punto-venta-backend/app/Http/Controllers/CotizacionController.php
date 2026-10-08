<?php

namespace App\Http\Controllers;

use App\Http\Requests\CotizacionRequest;
use App\Services\CotizacionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class CotizacionController extends Controller
{
    protected $cotizacionService;

    public function __construct(CotizacionService $cotizacionService)
    {
        $this->cotizacionService = $cotizacionService;
    }

    public function index()
    {
        return response()->json($this->cotizacionService->listarCotizaciones());
    }

    public function store(CotizacionRequest $request)
    {
        $cotizacion = $this->cotizacionService->crearCotizacion($request->validated());
        return response()->json($cotizacion, 201);
    }

    public function show($id)
    {
        return response()->json($this->cotizacionService->mostrar($id));
    }

    public function update(CotizacionRequest $request, $id)
    {
        $cotizacion = $this->cotizacionService->actualizarCotizacion($id, $request->validated());
        return response()->json($cotizacion, 200);
    }

    public function destroy($id)
    {
        $this->cotizacionService->eliminar($id);
        return response()->json(null, 204);
    }

    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string',
            'motivo_rechazo' => 'nullable|string'
        ]);

        $cotizacion = $this->cotizacionService->cambiarEstado($id, $request->estado, $request->motivo_rechazo);
        return response()->json($cotizacion, 200);
    }

    public function generarPdf($id)
    {
        $cotizacion = $this->cotizacionService->mostrar($id);
        
        $pdf = Pdf::loadView('pdf.cotizacion', compact('cotizacion'));
        
        return $pdf->stream('Cotizacion_'.$cotizacion->id.'.pdf');
    }
}
