<?php

namespace App\Services;

use App\Models\Impresora;

class ImpresoraService
{
    public const ANCHO_DEFECTO = 80;

    public function __construct(
        protected EmpresaService $empresaService,
        protected TicketPdfService $ticketPdfService
    ) {}

    public function obtener(): ?Impresora
    {
        return Impresora::first();
    }

    public function guardar(array $datos): Impresora
    {
        $impresora = Impresora::firstOrNew();
        $impresora->fill($datos)->save();

        return $impresora;
    }

    public function anchoConfigurado(): int
    {
        return $this->obtener()?->ancho ?? self::ANCHO_DEFECTO;
    }

    public function generarTicketPrueba(?string $nombre = null, ?int $ancho = null): string
    {
        $impresora = $this->obtener();
        $anchoFinal = $ancho ?? $impresora?->ancho ?? self::ANCHO_DEFECTO;
        $datos = [
            'empresa' => $this->empresaService->obtener(),
            'nombreImpresora' => $nombre ?? $impresora?->nombre ?? 'Sin configurar',
            'fecha' => now(),
        ];

        return $this->ticketPdfService->generar('pdf.ticket.ticket-prueba', $datos, $anchoFinal);
    }

    
}
