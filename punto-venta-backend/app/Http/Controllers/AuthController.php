<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Services\AuthService;
use Exception;

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
            $response = $this->authService->loginService($request->validated());
            return response()->json([
                'message' => 'Login exitoso',
                'user' => $response['user'],
                'token' => $response['token']
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 401);
        }


        // return response()->json([
        //     'user' => $response['user']
        // ])->cookie(
        //     'access_token',
        //     $response['token'],
        //     60 * 24, 
        //     '/',
        //     null,
        //     app()->environment('production'),
        //     true,
        //     false,
        //     'Lax'
        // );

    }
}
