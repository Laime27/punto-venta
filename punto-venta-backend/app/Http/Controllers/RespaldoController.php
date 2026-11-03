<?php

namespace App\Http\Controllers;

use App\Services\RespaldoService;

class RespaldoController extends Controller
{
    public function __construct(protected RespaldoService $respaldoService) {}

    public function descargar()
    {
        return response()->download($this->respaldoService->generar())->deleteFileAfterSend();
    }
}
