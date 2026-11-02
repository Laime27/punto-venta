<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('historial_movimientos')
            ->whereNull('fecha_emision')
            ->update(['fecha_emision' => DB::raw('created_at')]);
    }

    public function down(): void
    {
    }
};
