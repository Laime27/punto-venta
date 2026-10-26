<?php

namespace App\Http\Controllers;

use App\Http\Requests\ComprobanteRequest;
use App\Http\Requests\AnularComprobanteRequest;
use App\Http\Requests\AbonarCreditoRequest;
use App\Services\Comprobante\ComprobanteService;
use App\Services\Comprobante\ComprobantePostService;
use App\Services\Comprobante\ComprobanteAnulacionService;
use App\Services\Comprobante\ComprobanteCreditoService;
use App\Services\Comprobante\ComprobanteTicketService;
use Illuminate\Http\Request;

class ComprobanteController extends Controller
{
    protected $comprobanteService;
    protected $comprobantePostService;
    protected $comprobanteAnulacionService;
    protected $comprobanteCreditoService;
    protected $comprobanteTicketService;

    public function __construct(
        ComprobanteService $comprobanteService,
        ComprobantePostService $comprobantePostService,
        ComprobanteAnulacionService $comprobanteAnulacionService,
        ComprobanteCreditoService $comprobanteCreditoService,
        ComprobanteTicketService $comprobanteTicketService
    ) {
        $this->comprobanteService = $comprobanteService;
        $this->comprobantePostService = $comprobantePostService;
        $this->comprobanteAnulacionService = $comprobanteAnulacionService;
        $this->comprobanteCreditoService = $comprobanteCreditoService;
        $this->comprobanteTicketService = $comprobanteTicketService;
    }

    public function index(Request $request)
    {
        return response()->json($this->comprobanteService->listarComprobantes($request));
    }

    public function show($id)
    {
        return response()->json($this->comprobanteService->mostrar($id));
    }

    public function ticket($id)
    {
        $pdf = $this->comprobanteTicketService->generar((int) $id);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="ticket-' . $id . '.pdf"',
        ]);
    }

    public function registrarVenta(ComprobanteRequest $request)
    {
        $comprobante = $this->comprobantePostService->registrarVenta($request->validated());
        
        return response()->json([
            'message' => 'Venta registrada exitosamente',
            'data' => $comprobante
        ], 201);
    }

    public function anular(AnularComprobanteRequest $request, $id)
    {
        $comprobante = $this->comprobanteAnulacionService->anular($id, $request->motivo_anulacion);

        return response()->json([
            'message' => 'Comprobante anulado exitosamente',
            'data' => $comprobante
        ], 200);
    }

    public function abonarCredito(AbonarCreditoRequest $request, $id)
    {
        $this->comprobanteCreditoService->registrarAbono($id, $request->validated());

        return response()->json([
            'message' => 'Abono registrado exitosamente'
        ], 200);
    }
}
