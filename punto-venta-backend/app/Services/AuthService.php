<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Permiso;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function loginService($data)
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw new BusinessException('Credenciales incorrectas');
        }

        if (! $user->activo) {
            throw new BusinessException('Tu usuario está desactivado. Comunícate con el administrador.');
        }

        return [
            ...$this->datosSesion($user),
            'token' => $user->createToken('access-token')->plainTextToken,
        ];
    }

    public function datosSesion(User $user): array
    {
        return [
            'user' => $user->only(['id', 'name', 'email']),
            'rol' => $user->roles()->value('name'),
            'permisos' => $user->esAdministrador()
                ? Permiso::pluck('name')
                : $user->getAllPermissions()->pluck('name')->values(),
        ];
    }

    public function logoutService(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
