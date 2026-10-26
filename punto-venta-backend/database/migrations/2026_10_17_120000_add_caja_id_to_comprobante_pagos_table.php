<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('comprobante_pagos', function (Blueprint $table) {
            $table->foreignId('caja_id')->nullable()->after('comprobante_id')->constrained('cajas');
        });
    }


    public function down(): void
    {
        Schema::table('comprobante_pagos', function (Blueprint $table) {
            $table->dropForeign(['caja_id']);
            $table->dropColumn('caja_id');
        });
    }
};
