<?php

namespace App\Services;

use App\Models\Unidad;

class UnidadService
{
    public function listarUnidad()
    {
        return Unidad::all();
    }
}
