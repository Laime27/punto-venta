<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Permission;

class Permiso extends Permission
{
    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class);
    }
}
