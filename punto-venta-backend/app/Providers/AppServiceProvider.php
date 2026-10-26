<?php

namespace App\Providers;

use App\Services\EmpresaService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Todo el sistema trabaja con la zona horaria configurada en la empresa
        $zonaHoraria = EmpresaService::zonaHorariaActual();
        config(['app.timezone' => $zonaHoraria]);
        date_default_timezone_set($zonaHoraria);
    }
}
