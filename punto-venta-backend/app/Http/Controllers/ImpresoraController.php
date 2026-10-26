<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImpresoraRequest;
use App\Services\ImpresoraService;
use Illuminate\Http\Request;

class ImpresoraController extends Controller
{
    public function __construct(protected ImpresoraService $impresoraService) {}

    public function show()
    {
        return response()->json($this->impresoraService->obtener());
    }

    public function update(ImpresoraRequest $request)
    {
        $impresora = $this->impresoraService->guardar($request->validated());

        return response()->json([
            'message' => 'Impresora configurada correctamente',
            'data' => $impresora,
        ]);
    }

    public function ticketPrueba(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['nullable', 'string', 'max:255'],
            'ancho'  => ['nullable', 'integer'],
        ]);

        $pdf = $this->impresoraService->generarTicketPrueba(
            $datos['nombre'] ?? null,
            isset($datos['ancho']) ? (int) $datos['ancho'] : null
        );

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="ticket-prueba.pdf"',
        ]);
    }
}
