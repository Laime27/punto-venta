<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orden_compras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('serie_id')->nullable()->constrained('tipos_comprobantes');
            $table->string('serie', 10)->nullable();
            $table->string('correlativo', 10)->nullable();
            $table->foreignId('proveedor_id')->nullable()->constrained('proveedores'); 
            
            $table->datetime('fecha_emision')->nullable();
            $table->datetime('fecha_recepcion')->nullable();
            
            $table->enum('estado', ['PENDIENTE', 'RECIBIDA_PARCIAL', 'RECIBIDA_COMPLETA', 'ANULADA'])->default('PENDIENTE'); 
            
            $table->decimal('total_estimado', 10, 2)->default(0);
            $table->decimal('total_real', 10, 2)->default(0);
            
         
            $table->text('observaciones')->nullable();
            
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('orden_compra_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('orden_compra_id')->constrained('orden_compras')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos');
            
            $table->decimal('cantidad_pedida', 10, 2);
            $table->decimal('cantidad_recibida', 10, 2)->default(0);
            
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orden_compra_detalles');
        Schema::dropIfExists('orden_compras');
    }
};
