<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comprobante_detalles', function (Blueprint $table) {
            $table->decimal('costo_unitario', 10, 2)->default(0)->after('precio_unitario');
        });

        DB::table('comprobante_detalles')->update([
            'costo_unitario' => DB::raw('COALESCE((SELECT precio_compra FROM productos WHERE productos.id = comprobante_detalles.producto_id), 0)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('comprobante_detalles', function (Blueprint $table) {
            $table->dropColumn('costo_unitario');
        });
    }
};
