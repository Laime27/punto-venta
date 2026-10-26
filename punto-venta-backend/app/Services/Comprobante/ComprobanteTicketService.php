<?php

namespace App\Services\Comprobante;

use App\Models\Comprobante;
use App\Services\EmpresaService;
use App\Services\ImpresoraService;
use App\Services\TicketPdfService;

class ComprobanteTicketService
{
    public function __construct(
        protected EmpresaService $empresaService,
        protected ImpresoraService $impresoraService,
        protected TicketPdfService $ticketPdfService
    ) {}

    public function generar(int $id): string
    {
        $comprobante = Comprobante::with([
            'cliente',
            'tipoComprobante:id,nombre',
            'user:id,name',
            'detalles.producto:id,nombre,unidad_id',
            'detalles.producto.unidad:id,abreviatura',
            'pagos.metodoPago:id,nombre',
            'creditos',
        ])->findOrFail($id);

        $datos = [
            'empresa' => $this->empresaService->obtener(),
            'comprobante' => $comprobante,
            'vuelto' => round((float) $comprobante->pagos->sum('monto_devuelto'), 2),
            'saldoPendiente' => round((float) $comprobante->creditos->sum('saldo_pendiente'), 2),
        ];

        $ancho = $this->impresoraService->anchoConfigurado();

        return $this->ticketPdfService->generar('pdf.ticket.ticket-comprobante', $datos, $ancho);
    }
}
