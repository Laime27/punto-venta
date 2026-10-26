<?php

namespace App\Services;

use App\Models\Empresa;
use DateTime;
use DateTimeZone;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Throwable;

class EmpresaService
{
    public const ZONA_HORARIA_DEFECTO = 'America/Lima';
    private const CACHE_ZONA_HORARIA = 'empresa_timezone';

    public function __construct(protected ImagenService $imagenService) {}

    public function obtener(): Empresa
    {
        return Empresa::firstOrCreate([], [
            'nombre' => 'Mi Empresa',
            'moneda_simbolo' => 'S/',
            'timezone' => self::ZONA_HORARIA_DEFECTO,
        ]);
    }

    public function actualizar(array $datos, ?UploadedFile $logo = null): Empresa
    {
        $empresa = $this->obtener();

        $quitarLogo = !empty($datos['quitar_logo']);
        unset($datos['logo'], $datos['quitar_logo']);

        if ($logo) {
            $datos['logo'] = $this->imagenService->actualizar($empresa->logo, $logo, 'empresa');
        } elseif ($quitarLogo) {
            $this->imagenService->eliminar($empresa->logo);
            $datos['logo'] = null;
        }

        $empresa->update($datos);

        Cache::forget(self::CACHE_ZONA_HORARIA);

        return $empresa->fresh();
    }

    public static function zonaHorariaActual(): string
    {
        try {
            return Cache::rememberForever(
                self::CACHE_ZONA_HORARIA,
                fn() => Empresa::value('timezone') ?: self::ZONA_HORARIA_DEFECTO
            );
        } catch (Throwable) {
            return self::ZONA_HORARIA_DEFECTO;
        }
    }

    public function listarZonasHorarias(): array
    {
        $ahora = new DateTime('now', new DateTimeZone('UTC'));

        return collect(DateTimeZone::listIdentifiers())
            ->map(function (string $zona) use ($ahora) {
                $offset = (new DateTimeZone($zona))->getOffset($ahora);
                $signo = $offset < 0 ? '-' : '+';
                $horas = str_pad((string) intdiv(abs($offset), 3600), 2, '0', STR_PAD_LEFT);
                $minutos = str_pad((string) (abs($offset) % 3600 / 60), 2, '0', STR_PAD_LEFT);

                return [
                    'value' => $zona,
                    'label' => "(UTC{$signo}{$horas}:{$minutos}) {$zona}",
                    'offset' => $offset,
                ];
            })
            ->sortBy([['offset', 'asc'], ['value', 'asc']])
            ->values()
            ->all();
    }
}
