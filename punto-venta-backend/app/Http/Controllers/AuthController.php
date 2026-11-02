<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(AuthRequest $request)
    {
        try {
            return response()->json([
                'message' => 'Login exitoso',
                ...$this->authService->loginService($request->validated()),
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }
    }

    public function me(Request $request)
    {
        return response()->json($this->authService->datosSesion($request->user()), 200);
    }

    public function logout(Request $request)
    {
        try {
            $this->authService->logoutService($request->user());
            return response()->json([
                'message' => 'Sesión cerrada exitosamente'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
