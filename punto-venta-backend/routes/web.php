<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

Route::get('storage/{ruta}', function (string $ruta) {
    abort_unless(Storage::disk('public')->exists($ruta), 404);

    return Storage::disk('public')->response($ruta);
})->where('ruta', '.*');
