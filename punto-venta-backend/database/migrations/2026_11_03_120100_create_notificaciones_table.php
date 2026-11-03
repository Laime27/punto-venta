<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->unique();
            $table->string('tipo', 40);
            $table->string('titulo');
            $table->string('mensaje');
            $table->string('url')->nullable();
            $table->string('permiso');
            $table->timestamps();
        });

        Schema::create('notificacion_usuario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notificacion_id')->constrained('notificaciones')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('leida_at')->nullable();
            $table->timestamp('eliminada_at')->nullable();
            $table->unique(['notificacion_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificacion_usuario');
        Schema::dropIfExists('notificaciones');
    }
};
