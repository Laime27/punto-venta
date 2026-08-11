<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('unidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('abreviatura');
            $table->boolean('permite_decimales')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('precio_compra', 10, 2)->default(0);
            $table->decimal('precio_venta', 10, 2)->default(0);
            $table->decimal('precio_mayoreo', 10, 2)->default(0);
            $table->decimal('stock', 15, 2)->default(0);
            $table->decimal('stock_minimo', 15, 2)->default(5);
            $table->string('codigo_barras')->nullable();
            $table->foreignId('categoria_id')->nullable()->constrained('categorias');
            $table->foreignId('unidad_id')->nullable()->constrained('unidades');
            $table->string('imagen')->nullable();
            $table->boolean('disponible_venta')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('producto_proveedor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('proveedor_id')->constrained('proveedores')->onDelete('cascade');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('producto_proveedor');
        Schema::dropIfExists('productos');
    }
};
