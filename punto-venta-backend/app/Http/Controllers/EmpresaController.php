<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmpresaRequest;
use App\Services\EmpresaService;

class EmpresaController extends Controller
{
    public function __construct(protected EmpresaService $empresaService) {}

    public function show()
    {
        return response()->json($this->empresaService->obtener());
    }

    public function zonasHorarias()
    {
        return response()->json($this->empresaService->listarZonasHorarias());
    }

    public function update(EmpresaRequest $request)
    {
        $empresa = $this->empresaService->actualizar(
            $request->validated(),
            $request->file('logo')
        );

        return response()->json([
            'message' => 'Datos de la empresa actualizados correctamente',
            'data' => $empresa,
        ]);
    }
}
