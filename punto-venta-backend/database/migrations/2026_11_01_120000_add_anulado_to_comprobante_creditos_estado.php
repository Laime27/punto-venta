<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comprobante_creditos', function (Blueprint $table) {
            $table->enum('estado', ['pendiente', 'pagado', 'anulado'])->default('pendiente')->change();
        });

        DB::table('comprobante_creditos')
            ->whereIn('comprobante_id', DB::table('comprobantes')->where('estado', 'anulado')->select('id'))
            ->update(['estado' => 'anulado']);
    }

    public function down(): void
    {
        DB::table('comprobante_creditos')->where('estado', 'anulado')->update(['estado' => 'pagado']);

        Schema::table('comprobante_creditos', function (Blueprint $table) {
            $table->enum('estado', ['pendiente', 'pagado'])->default('pendiente')->change();
        });
    }
};
