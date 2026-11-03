<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UsuarioService
{
    public function listar(array $filtros): LengthAwarePaginator
    {
        return User::with('roles:id,name')
            ->when($filtros['search'] ?? null, fn ($query, $search) => $query->where(
                fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")
            ))
            ->when($filtros['rol_id'] ?? null, fn ($query, $rolId) => $query->whereHas('roles', fn ($q) => $q->where('id', $rolId)))
            ->when(isset($filtros['activo']), fn ($query) => $query->where('activo', $filtros['activo']))
            ->orderBy('name')
            ->paginate($filtros['per_page'] ?? 10)
            ->through(fn (User $usuario) => $this->mapear($usuario));
    }

    public function obtener(int $id): array
    {
        return $this->mapear(User::with('roles:id,name')->findOrFail($id));
    }

    public function crear(array $datos): array
    {
        return DB::transaction(function () use ($datos) {
            $usuario = User::create([
                'name' => $datos['name'],
                'email' => $datos['email'],
                'password' => $datos['password'],
                'activo' => true,
            ]);

            $usuario->syncRoles(Rol::findOrFail($datos['rol_id']));

            return $this->mapear($usuario->load('roles:id,name'));
        });
    }

    public function actualizar(int $id, array $datos, int $usuarioActualId): array
    {
        $usuario = User::with('roles')->findOrFail($id);

        if ($usuario->is_admin && $usuario->id !== $usuarioActualId) {
            throw new BusinessException('Solo el dueño del sistema puede modificar su propia cuenta.');
        }

        $rolNuevo = Rol::findOrFail($datos['rol_id']);

        if ($usuario->is_admin && !$rolNuevo->esAdministrador()) {
            throw new BusinessException('El rol del dueño del sistema no se puede cambiar.');
        }

        if ($usuario->esAdministrador() && !$rolNuevo->esAdministrador()) {
            $this->validarQuedaOtroAdministrador($usuario);
        }

        return DB::transaction(function () use ($usuario, $datos, $rolNuevo) {
            $usuario->update([
                'name' => $datos['name'],
                'email' => $datos['email'],
                ...(!empty($datos['password']) ? ['password' => $datos['password']] : []),
            ]);

            $usuario->syncRoles($rolNuevo);

            return $this->mapear($usuario->load('roles:id,name'));
        });
    }

    public function cambiarEstado(int $id, int $usuarioActualId): array
    {
        $usuario = User::with('roles')->findOrFail($id);

        if ($usuario->id === $usuarioActualId) {
            throw new BusinessException('No puedes desactivar tu propio usuario.');
        }

        if ($usuario->is_admin) {
            throw new BusinessException('El dueño del sistema no se puede desactivar.');
        }

        if ($usuario->activo && $usuario->esAdministrador()) {
            $this->validarQuedaOtroAdministrador($usuario);
        }

        $usuario->update(['activo' => !$usuario->activo]);

        if (!$usuario->activo) {
            $usuario->tokens()->delete();
        }

        return $this->mapear($usuario);
    }

    private function validarQuedaOtroAdministrador(User $usuario): void
    {
        $otrosAdministradores = User::role(Rol::ADMINISTRADOR)
            ->where('activo', true)
            ->whereKeyNot($usuario->id)
            ->exists();

        if (!$otrosAdministradores) {
            throw new BusinessException('Debe quedar al menos un administrador activo en el sistema.');
        }
    }

    private function mapear(User $usuario): array
    {
        $rol = $usuario->roles->first();

        return [
            'id' => $usuario->id,
            'name' => $usuario->name,
            'email' => $usuario->email,
            'activo' => $usuario->activo,
            'es_dueno' => $usuario->is_admin,
            'rol' => $rol ? ['id' => $rol->id, 'nombre' => $rol->name] : null,
            'created_at' => $usuario->created_at?->toDateTimeString(),
        ];
    }
}
