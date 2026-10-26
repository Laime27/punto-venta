<?php

namespace App\Services;

use App\Models\Empresa;
use Barryvdh\DomPDF\Facade\Pdf;

class TicketPdfService
{
    private const MM_A_PUNTOS = 72 / 25.4;
    private const ALTO_MEDICION = 10000;

    public function generar(string $vista, array $datos, int $anchoMm): string
    {
        $datos = array_merge($datos, [
            'anchoMm' => $anchoMm,
            'logoBase64' => $this->logoEmpresaBase64($datos['empresa'] ?? null),
        ]);

        $anchoPt = $anchoMm * self::MM_A_PUNTOS;
        $altoPt = $this->medirAlto($vista, $datos, $anchoPt);

        return Pdf::loadView($vista, $datos)
            ->setOption('isFontSubsettingEnabled', true)
            ->setPaper([0, 0, $anchoPt, $altoPt])
            ->output();
    }

    private function medirAlto(string $vista, array $datos, float $anchoPt): float
    {
        $alto = 0;

        $dompdf = Pdf::loadView($vista, $datos)
            ->setPaper([0, 0, $anchoPt, self::ALTO_MEDICION])
            ->getDomPDF();

        $dompdf->setCallbacks([[
            'event' => 'end_frame',
            'f' => function ($frame) use (&$alto) {
                if ($frame->get_node()->nodeName === 'body') {
                    $alto = max($alto, (float) $frame->get_margin_height());
                }
            },
        ]]);

        $dompdf->render();

        return $alto + 10;
    }

    private function logoEmpresaBase64(?Empresa $empresa): ?string
    {
        if (!$empresa?->logo) return null;

        $ruta = ltrim(parse_url($empresa->logo, PHP_URL_PATH) ?? '', '/');
        $ruta = storage_path('app/public/' . preg_replace('#^storage/#', '', $ruta));

        if (!is_file($ruta)) return null;

        $mime = mime_content_type($ruta) ?: 'image/png';
        return "data:{$mime};base64," . base64_encode(file_get_contents($ruta));
    }
}
