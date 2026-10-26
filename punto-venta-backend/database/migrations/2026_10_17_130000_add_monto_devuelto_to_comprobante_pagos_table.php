<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('comprobante_pagos', function (Blueprint $table) {
            $table->decimal('monto_devuelto', 15, 2)->default(0)->after('monto');
        });
    }


    public function down(): void
    {
        Schema::table('comprobante_pagos', function (Blueprint $table) {
            $table->dropColumn('monto_devuelto');
        });
    }
};
