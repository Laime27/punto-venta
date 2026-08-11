<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {

        Schema::create('tipos_comprobantes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo_sunat', 2);
            $table->string('serie', 10);
            $table->string('correlativo', 10)->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('comprobantes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_venta');
            $table->foreignId('cliente_id')->constrained('clientes');
            $table->foreignId('tipo_comprobante_id')->constrained('tipos_comprobantes');
            $table->string('serie', 10);
            $table->string('correlativo', 10);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('impuesto', 15, 2)->default(0);
            $table->decimal('descuento', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->enum('estado', ['pagado', 'pendiente', 'anulado'])->default('pagado');
            $table->text('motivo_anulacion')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('comprobante_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comprobante_id')->constrained('comprobantes');
            $table->foreignId('producto_id')->constrained('productos');
            $table->decimal('cantidad', 15, 2);
            $table->decimal('precio_unitario', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('comprobante_pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comprobante_id')->constrained('comprobantes');
            $table->foreignId('metodo_pago_id')->constrained('metodos_pagos');
            $table->decimal('monto', 15, 2);
            $table->string('referencia')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('comprobante_pagos');
        Schema::dropIfExists('comprobante_detalles');
        Schema::dropIfExists('comprobantes');
        Schema::dropIfExists('tipos_comprobantes');
    }

};
