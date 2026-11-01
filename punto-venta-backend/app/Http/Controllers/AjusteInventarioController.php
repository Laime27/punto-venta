<?php

namespace App\Http\Controllers;

use App\Http\Requests\AjusteInventarioRequest;
use App\Services\AjusteInventarioService;
use Illuminate\Http\Request;

class AjusteInventarioController extends Controller
{
    public function __construct(protected AjusteInventarioService $ajusteInventarioService) {}

    public function index(Request $request)
    {
        return response()->json($this->ajusteInventarioService->listarAjustes($request));
    }

    public function store(AjusteInventarioRequest $request)
    {
        $ajuste = $this->ajusteInventarioService->crearAjuste($request->validated());

        return response()->json($ajuste, 201);
    }

    public function show(int $id)
    {
        return response()->json($this->ajusteInventarioService->mostrar($id));
    }
}
