<?php

namespace App\Models;

use Spatie\Permission\Models\Role;

class Rol extends Role
{
    public const ADMINISTRADOR = 'Administrador';

    public function esAdministrador(): bool
    {
        return $this->name === self::ADMINISTRADOR;
    }
}
