<?php

namespace App\Http\Controllers;

use App\Services\UnidadService;

class UnidadController extends Controller
{
    public function __construct(protected UnidadService $unidadService) {}

    public function index()
    {
        return response()->json($this->unidadService->listarUnidad());
    }
}
