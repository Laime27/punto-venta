<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            // Venta generada desde la cotización; vuelve a null si esa venta se anula
            $table->foreignId('comprobante_id')->nullable()->after('estado')->constrained('comprobantes');
        });
    }

    public function down(): void
    {
        Schema::table('cotizaciones', function (Blueprint $table) {
            $table->dropForeign(['comprobante_id']);
            $table->dropColumn('comprobante_id');
        });
    }
};
