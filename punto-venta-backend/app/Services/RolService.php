<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Grupo;
use App\Models\Rol;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RolService
{
    private const GUARD = 'web';

    public function listar(): Collection
    {
        $usuariosPorRol = $this->usuariosPorRol();

        return Rol::withCount('permissions')
            ->orderBy('id')
            ->get()
            ->map(fn (Rol $rol) => [
                'id' => $rol->id,
                'name' => $rol->name,
                'descripcion' => $rol->descripcion,
                'usuarios' => (int) ($usuariosPorRol[$rol->id] ?? 0),
                'permisos' => $rol->permissions_count,
                'es_administrador' => $rol->esAdministrador(),
            ]);
    }

    public function listarSelect(): Collection
    {
        return Rol::orderBy('id')->get(['id', 'name as nombre']);
    }

    public function obtener(int $id): array
    {
        $rol = Rol::with('permissions:id')->findOrFail($id);

        return [
            'id' => $rol->id,
            'name' => $rol->name,
            'descripcion' => $rol->descripcion,
            'es_administrador' => $rol->esAdministrador(),
            'permisos' => $rol->permissions->pluck('id'),
        ];
    }

    public function listarGruposPermisos(): Collection
    {
        return Grupo::with(['permisos' => fn ($query) => $query->orderBy('id')->select('id', 'grupo_id', 'name', 'descripcion')])
            ->whereHas('permisos')
            ->orderBy('orden')
            ->get(['id', 'nombre']);
    }

    public function crear(array $datos): Rol
    {
        return DB::transaction(function () use ($datos) {
            $rol = Rol::create([
                'name' => $datos['name'],
                'descripcion' => $datos['descripcion'] ?? null,
                'guard_name' => self::GUARD,
            ]);

            $rol->syncPermissions($datos['permisos']);

            return $rol;
        });
    }

    public function actualizar(int $id, array $datos): Rol
    {
        $rol = Rol::findOrFail($id);
        $this->validarEditable($rol);

        return DB::transaction(function () use ($rol, $datos) {
            $rol->update([
                'name' => $datos['name'],
                'descripcion' => $datos['descripcion'] ?? null,
            ]);

            $rol->syncPermissions($datos['permisos']);

            return $rol;
        });
    }

    public function eliminar(int $id): void
    {
        $rol = Rol::findOrFail($id);
        $this->validarEditable($rol);
        $usuarios = $rol->users()->count();

        if ($usuarios > 0) {
            throw new BusinessException("No se puede eliminar el rol {$rol->name} porque tiene {$usuarios} usuario(s) asignado(s).");
        }

        $rol->delete();
    }

    private function usuariosPorRol(): Collection
    {
        return DB::table(config('permission.table_names.model_has_roles'))
            ->selectRaw('role_id, COUNT(*) as total')
            ->groupBy('role_id')
            ->pluck('total', 'role_id');
    }

    private function validarEditable(Rol $rol): void
    {
        if ($rol->esAdministrador()) {
            throw new BusinessException('El rol Administrador no se puede modificar ni eliminar.');
        }
    }
}
