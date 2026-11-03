<?php

namespace App\Http\Controllers;

use App\Services\Notificacion\NotificacionService;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function __construct(protected NotificacionService $notificacionService) {}

    public function index(Request $request)
    {
        return response()->json($this->notificacionService->listar($request->user()));
    }

    public function leer(Request $request, int $id)
    {
        $this->notificacionService->marcarLeida($request->user(), $id);

        return response()->json(null, 204);
    }

    public function leerTodas(Request $request)
    {
        $this->notificacionService->marcarTodasLeidas($request->user());

        return response()->json(null, 204);
    }

    public function destroy(Request $request, int $id)
    {
        $this->notificacionService->eliminar($request->user(), $id);

        return response()->json(null, 204);
    }
}
