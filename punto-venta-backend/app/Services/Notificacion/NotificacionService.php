<?php

namespace App\Services\Notificacion;

use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class NotificacionService
{
    private const LIMITE = 50;
    private const SEGUNDOS_ENTRE_SINCRONIZACIONES = 60;
    private const TABLA_USUARIO = 'notificacion_usuario';
    private const SUFIJO_KARDEX = '/kardex';
    private const PERMISO_KARDEX = 'inventario.movimientos';
    private const URL_PRODUCTOS = '/producto';

    public function __construct(protected AlertaService $alertaService) {}

    public function listar(User $usuario): array
    {
        $this->sincronizar();

        return [
            'no_leidas' => $this->visibles($usuario)->whereNull('nu.leida_at')->count(),
            'notificaciones' => $this->visibles($usuario)
                ->select('notificaciones.id', 'tipo', 'titulo', 'mensaje', 'url', 'notificaciones.created_at', 'nu.leida_at')
                ->orderByRaw('nu.leida_at IS NOT NULL')
                ->latest('notificaciones.id')
                ->limit(self::LIMITE)
                ->get()
                ->each(fn (Notificacion $notificacion) => $notificacion->url = $this->urlParaUsuario($usuario, $notificacion->url)),
        ];
    }

    private function urlParaUsuario(User $usuario, string $url): string
    {
        return str_ends_with($url, self::SUFIJO_KARDEX) && !$usuario->can(self::PERMISO_KARDEX) ? self::URL_PRODUCTOS : $url;
    }

    public function marcarLeida(User $usuario, int $id): void
    {
        $this->registrar($usuario, $this->visibles($usuario)->where('notificaciones.id', $id)->firstOrFail(['notificaciones.id'])->id, ['leida_at' => now()]);
    }

    public function marcarTodasLeidas(User $usuario): void
    {
        $this->visibles($usuario)
            ->whereNull('nu.leida_at')
            ->pluck('notificaciones.id')
            ->each(fn (int $id) => $this->registrar($usuario, $id, ['leida_at' => now()]));
    }

    public function eliminar(User $usuario, int $id): void
    {
        $this->registrar($usuario, $this->visibles($usuario)->where('notificaciones.id', $id)->firstOrFail(['notificaciones.id'])->id, ['eliminada_at' => now()]);
    }

    private function sincronizar(): void
    {
        if (!Cache::add('notificaciones.sincronizacion', true, self::SEGUNDOS_ENTRE_SINCRONIZACIONES)) {
            return;
        }

        $alertas = $this->alertaService->obtenerActivas();

        DB::transaction(function () use ($alertas) {
            Notificacion::whereNotIn('clave', $alertas->pluck('clave'))->delete();

            $ahora = now();
            $alertas
                ->map(fn (array $alerta) => [...$alerta, 'created_at' => $ahora, 'updated_at' => $ahora])
                ->chunk(200)
                ->each(fn ($bloque) => Notificacion::upsert($bloque->values()->all(), ['clave'], ['titulo', 'mensaje', 'url', 'updated_at']));
        });
    }

    private function visibles(User $usuario): Builder
    {
        return Notificacion::leftJoin(self::TABLA_USUARIO . ' as nu', fn ($join) => $join
                ->on('nu.notificacion_id', '=', 'notificaciones.id')
                ->where('nu.user_id', $usuario->id))
            ->whereNull('nu.eliminada_at')
            ->when(!$usuario->esAdministrador(), fn ($query) => $query->whereIn('permiso', $usuario->getAllPermissions()->pluck('name')));
    }

    private function registrar(User $usuario, int $notificacionId, array $valores): void
    {
        DB::table(self::TABLA_USUARIO)->updateOrInsert(
            ['notificacion_id' => $notificacionId, 'user_id' => $usuario->id],
            $valores
        );
    }
}
