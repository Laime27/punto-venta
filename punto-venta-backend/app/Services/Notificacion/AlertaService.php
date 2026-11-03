<?php

namespace App\Services\Notificacion;

use App\Enums\EstadoCajaEnum;
use App\Enums\EstadoComprobanteEnum;
use App\Enums\EstadoCotizacionEnum;
use App\Models\Caja;
use App\Models\ComprobanteCredito;
use App\Models\Cotizacion;
use App\Models\Producto;
use App\Services\EmpresaService;
use App\Services\Reporte\ReporteInventarioService;
use Illuminate\Support\Collection;

class AlertaService
{
    private const DIAS_AVISO = 3;

    public function __construct(protected EmpresaService $empresaService) {}

    public function obtenerActivas(): Collection
    {
        return collect([
            ...$this->alertasStock(),
            ...$this->alertasCuotas(),
            ...$this->alertasCotizaciones(),
            ...$this->alertasCaja(),
        ]);
    }

    private function alertasStock(): array
    {
        return Producto::whereRaw('stock <= stock_minimo * ?', [ReporteInventarioService::FACTOR_POR_AGOTARSE])
            ->get(['id', 'nombre', 'stock', 'stock_minimo'])
            ->map(function (Producto $producto) {
                $esBajo = (float) $producto->stock <= (float) $producto->stock_minimo;
                $tipo = $esBajo ? 'stock_bajo' : 'stock_por_agotarse';

                return $this->alerta(
                    "{$tipo}:{$producto->id}",
                    $tipo,
                    $esBajo ? 'Stock bajo' : 'Producto por agotarse',
                    "{$producto->nombre}: quedan " . (float) $producto->stock . ' (mínimo ' . (float) $producto->stock_minimo . ')',
                    "/producto/{$producto->id}/kardex",
                    'producto.ver'
                );
            })
            ->all();
    }

    private function alertasCuotas(): array
    {
        $hoy = now()->toDateString();
        $simbolo = $this->empresaService->obtener()->moneda_simbolo;

        return ComprobanteCredito::with('comprobante:id,serie,correlativo,cliente_id', 'comprobante.cliente:id,nombre')
            ->where('saldo_pendiente', '>', 0)
            ->whereDate('fecha', '<=', now()->addDays(self::DIAS_AVISO)->toDateString())
            ->whereHas('comprobante', fn ($query) => $query->where('estado', '!=', EstadoComprobanteEnum::ANULADO->value))
            ->get()
            ->map(function (ComprobanteCredito $cuota) use ($hoy, $simbolo) {
                $fecha = substr((string) $cuota->fecha, 0, 10);
                $vencida = $fecha < $hoy;
                $tipo = $vencida ? 'cuota_vencida' : 'cuota_por_vencer';
                $venta = "{$cuota->comprobante->serie}-{$cuota->comprobante->correlativo}";

                return $this->alerta(
                    "{$tipo}:{$cuota->id}",
                    $tipo,
                    $vencida ? 'Cuota vencida' : 'Cuota por vencer',
                    "{$cuota->comprobante->cliente?->nombre} · {$venta}: {$simbolo} " . number_format((float) $cuota->saldo_pendiente, 2) . " ({$fecha})",
                    "/comprobante/{$cuota->comprobante->id}/abonar",
                    'comprobante.abonar'
                );
            })
            ->all();
    }

    private function alertasCotizaciones(): array
    {
        return Cotizacion::with('cliente:id,nombre')
            ->where('estado', EstadoCotizacionEnum::PENDIENTE->value)
            ->whereBetween('fecha_vencimiento', [now()->startOfDay(), now()->addDays(self::DIAS_AVISO)->endOfDay()])
            ->get()
            ->map(fn (Cotizacion $cotizacion) => $this->alerta(
                "cotizacion_por_vencer:{$cotizacion->id}",
                'cotizacion_por_vencer',
                'Cotización por vencer',
                "{$cotizacion->serie}-{$cotizacion->correlativo}" . ($cotizacion->cliente ? " · {$cotizacion->cliente->nombre}" : '') . ': vence el ' . substr((string) $cotizacion->fecha_vencimiento, 0, 10),
                "/cotizacion/{$cotizacion->id}/ver",
                'cotizacion.ver'
            ))
            ->all();
    }

    private function alertasCaja(): array
    {
        return Caja::where('estado', EstadoCajaEnum::ABIERTA->value)
            ->whereDate('fecha_apertura', '<', now()->toDateString())
            ->get()
            ->map(fn (Caja $caja) => $this->alerta(
                "caja_sin_cerrar:{$caja->id}",
                'caja_sin_cerrar',
                'Caja sin cerrar',
                'La caja sigue abierta desde el ' . substr((string) $caja->fecha_apertura, 0, 10),
                '/caja',
                'caja.cerrar'
            ))
            ->all();
    }

    private function alerta(string $clave, string $tipo, string $titulo, string $mensaje, string $url, string $permiso): array
    {
        return compact('clave', 'tipo', 'titulo', 'mensaje', 'url', 'permiso');
    }
}
