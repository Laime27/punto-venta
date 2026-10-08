<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class ImagenService
{
    protected string $disco = 'public';

    public function guardar(UploadedFile $archivo, string $carpeta = 'productos'): string
    {
        if (!file_exists(public_path('storage'))) {
            Artisan::call('storage:link');
        }

        $ruta = $archivo->store($carpeta, $this->disco);
        return Storage::disk($this->disco)->url($ruta);
    }

    public function actualizar(?string $rutaAnterior, UploadedFile $archivo, string $carpeta = 'productos'): string
    {
        $this->eliminar($rutaAnterior);
        return $this->guardar($archivo, $carpeta);
    }

    public function eliminar(?string $url): void
    {
        if (!$url) return;
        $ruta = ltrim(parse_url($url, PHP_URL_PATH), '/') ;
        $ruta = preg_replace('#^storage/#', '', $ruta);
        if (Storage::disk($this->disco)->exists($ruta)) {
            Storage::disk($this->disco)->delete($ruta);
        }
    }
}
