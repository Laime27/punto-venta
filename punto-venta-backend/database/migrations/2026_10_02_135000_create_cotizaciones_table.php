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
        Schema::create('cotizaciones', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('serie_id')->nullable()->constrained('tipos_comprobantes');
            $table->string('serie', 10)->nullable();
            $table->string('correlativo', 10)->nullable();
            
            $table->foreignId('cliente_id')->nullable()->constrained('clientes'); 
            
            $table->datetime('fecha_emision')->nullable();
            $table->datetime('fecha_vencimiento')->nullable();
            
            $table->enum('estado', ['PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'VENCIDA'])->default('PENDIENTE');
            
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('descuento', 10, 2)->default(0);
            $table->decimal('porcentaje_impuesto', 10, 2)->default(0);
            $table->decimal('monto_impuesto', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            
            $table->text('observaciones')->nullable();
            
            $table->foreignId('user_id')->constrained('users');
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('cotizacion_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cotizacion_id')->constrained('cotizaciones')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos');
            
            $table->decimal('cantidad', 10, 2);
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('descuento_unitario', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cotizacion_detalles');
        Schema::dropIfExists('cotizaciones');
    }
};
