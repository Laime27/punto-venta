<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('make:module {name}')]
#[Description('Crear Model, Migration, Controller, Request,Factory y Service')]
class MakeModule extends Command
{
    // protected $signature = 'make:module {name}';

    public function handle()
    {
        $name = $this->argument('name');

        // Model + Migration
        // $this->call('make:model', [
        //     'name' => $name,
        //     '--migration' => true,
        // ]);

        // Controller API
        $this->call('make:controller', [
            'name' => "{$name}Controller",
        ]);

        // Request
        $this->call('make:request', [
            'name' => "{$name}Request",
        ]);

        // Factory
        // Factory
        // $this->call('make:factory', [
        //     'name' => "{$name}Factory",
        //     '--model' => $name,
        // ]);

        // Service
        $servicePath = app_path("Services/{$name}Service.php");

        if (!is_dir(app_path('Services'))) {
            mkdir(app_path('Services'), 0755, true);
        }

        file_put_contents(
            $servicePath,
            <<<PHP
            <?php

            namespace App\Services;

            class {$name}Service
            {
               
            }

            PHP
        );

        $this->info("Módulo {$name} creado correctamente.");
    }
}
