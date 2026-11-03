<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrdenCompraRequest;
use App\Http\Requests\RecibirOrdenCompraRequest;
use App\Services\OrdenCompra\OrdenCompraService;
use App\Services\OrdenCompra\RecibirOrdenCompraService;

class OrdenCompraController extends Controller
{
    protected $ordenCompraService;
    protected $recibirOrdenCompraService;

    public function __construct(OrdenCompraService $ordenCompraService, RecibirOrdenCompraService $recibirOrdenCompraService)
    {
        $this->ordenCompraService = $ordenCompraService;
        $this->recibirOrdenCompraService = $recibirOrdenCompraService;
    }

    public function index()
    {
        return response()->json($this->ordenCompraService->listarOrdenesCompra());
    }

    public function store(OrdenCompraRequest $request)
    {
        $ordenCompra = $this->ordenCompraService->crearOrdenCompra($request->validated());
        return response()->json($ordenCompra, 201);
    }

    public function update(OrdenCompraRequest $request, $id)
    {
        $ordenCompra = $this->ordenCompraService->actualizarOrdenCompra($id, $request->validated());
        return response()->json($ordenCompra, 200);
    }

    public function recibir(RecibirOrdenCompraRequest $request, $id)
    {
        $ordenCompra = $this->recibirOrdenCompraService->recibir($id, $request->validated());
        return response()->json($ordenCompra, 200);
    }

    public function anular($id)
    {
        return response()->json($this->ordenCompraService->anular($id));
    }

    public function show($id)
    {
        return response()->json($this->ordenCompraService->mostrar($id));
    }
}
