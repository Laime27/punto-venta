<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Exception;

class AuthService
{
    public function loginService($data)
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw new Exception('Credenciales incorrectas');
        }

        $token = $user->createToken('access-token')->plainTextToken;
        
        return [
            'user' => $user,
            'token' => $token
        ];
    }



}
