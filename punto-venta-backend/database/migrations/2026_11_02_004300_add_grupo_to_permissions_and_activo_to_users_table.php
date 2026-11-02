<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grupos', function (Blueprint $table) {
            $table->unsignedSmallInteger('orden')->default(0)->after('nombre');
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->foreignId('grupo_id')->nullable()->after('id')->constrained('grupos');
            $table->string('descripcion')->nullable()->after('name');
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->string('descripcion')->nullable()->after('name');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->boolean('activo')->default(true)->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('activo'));
        Schema::table('roles', fn (Blueprint $table) => $table->dropColumn('descripcion'));
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('grupo_id');
            $table->dropColumn('descripcion');
        });
        Schema::table('grupos', fn (Blueprint $table) => $table->dropColumn('orden'));
    }
};
