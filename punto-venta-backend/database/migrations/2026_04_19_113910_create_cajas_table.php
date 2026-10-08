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
        Schema::create('cajas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('abierto_por')->constrained('users');
            $table->foreignId('cerrado_por')->nullable()->constrained('users');
            $table->dateTime('fecha_apertura');
            $table->dateTime('fecha_cierre')->nullable();
            $table->decimal('monto_apertura', 15, 2)->default(0);
            $table->decimal('saldo_teorico', 15, 2)->nullable();
            $table->decimal('monto_real', 15, 2)->nullable();
            $table->decimal('diferencia', 15, 2)->nullable();
            $table->enum('estado', ['abierta', 'cerrada','anulada'])->default('abierta');
            $table->text('observaciones')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('movimiento_cajas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_id')->constrained('cajas');
            $table->foreignId('user_id')->constrained('users');
            $table->enum('tipo', ['ingreso', 'egreso']);
            $table->decimal('monto', 15, 2);
            $table->string('motivo');
            $table->text('observaciones')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        
    }

   
    public function down(): void
    {
        Schema::dropIfExists('cajas');
        Schema::dropIfExists('movimiento_cajas');
    }
};
