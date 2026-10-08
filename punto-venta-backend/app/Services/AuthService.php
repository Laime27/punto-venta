<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Exception;
use App\Exceptions\BusinessException;

class AuthService
{
    public function loginService($data)
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw new BusinessException('Credenciales incorrectas');
        }

        $token = $user->createToken('access-token')->plainTextToken;
        
        return [
            'user' => $user,
            'token' => $token
        ];
    }



}
