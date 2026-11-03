<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('users')->where('is_admin', true)->exists()) {
            return;
        }

        $duenoId = DB::table('users')
            ->join('model_has_roles', 'model_has_roles.model_id', '=', 'users.id')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('roles.name', 'Administrador')
            ->orderBy('users.id')
            ->value('users.id');

        if ($duenoId) {
            DB::table('users')->where('id', $duenoId)->update(['is_admin' => true]);
        }
    }

    public function down(): void
    {
    }
};
