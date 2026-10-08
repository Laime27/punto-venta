<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comprobante_creditos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comprobante_id')->constrained('comprobantes');
            $table->date('fecha');
            $table->decimal('monto', 10, 2);
            $table->decimal('saldo_pendiente', 10, 2);
            $table->enum('estado', ['pendiente', 'pagado'])->default('pendiente');
            $table->timestamps();
        });

        Schema::table('comprobantes', function (Blueprint $table) {
            $table->foreignId('serie_id')->nullable()->after('serie');
        });
    }

   
    public function down(): void
    {
        if (Schema::hasColumn('comprobantes', 'serie_id')) {
            Schema::table('comprobantes', function (Blueprint $table) {
                $table->dropColumn('serie_id');
            });
        }
        Schema::dropIfExists('comprobante_creditos');
    }
};
