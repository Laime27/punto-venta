<?php

use App\Services\CodigoBarrasService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ajustes_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('serie_id')->nullable()->constrained('tipos_comprobantes');
            $table->string('serie', 10)->nullable();
            $table->string('correlativo', 10)->nullable();
            $table->foreignId('tipo_movimiento_id')->constrained('tipos_movimientos');
            $table->text('motivo')->nullable();
            $table->datetime('fecha_emision');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ajuste_inventario_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ajuste_inventario_id')->constrained('ajustes_inventario')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos');
            $table->decimal('cantidad', 15, 2);
            $table->decimal('stock_anterior', 15, 2);
            $table->decimal('stock_actual', 15, 2);
            $table->decimal('diferencia', 15, 2);
            $table->decimal('costo_unitario', 10, 2)->default(0);
            $table->timestamps();
        });

        if (DB::table('tipos_comprobantes')->count() > 0 && !DB::table('tipos_comprobantes')->where('codigo_sunat', 'AI')->exists()) {
            DB::table('tipos_comprobantes')->insert([
                'nombre' => 'AJUSTE DE INVENTARIO',
                'codigo_sunat' => 'AI',
                'serie' => 'AJ01',
                'correlativo' => '0',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $codigoBarras = new CodigoBarrasService();
        DB::table('productos')
            ->where(fn($q) => $q->whereNull('codigo_barras')->orWhere('codigo_barras', ''))
            ->orderBy('id')
            ->pluck('id')
            ->each(fn($id) => DB::table('productos')->where('id', $id)->update(['codigo_barras' => $codigoBarras->generar($id)]));
    }

    public function down(): void
    {
        Schema::dropIfExists('ajuste_inventario_detalles');
        Schema::dropIfExists('ajustes_inventario');
        DB::table('tipos_comprobantes')->where('codigo_sunat', 'AI')->delete();
    }
};
