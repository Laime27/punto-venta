<?php

namespace App\Services\Comprobante;

use App\Models\Comprobante;
use App\Models\ComprobanteCredito;
use App\Enums\EstadoComprobanteEnum;
use App\Enums\FormaPagoEnum;
use Illuminate\Support\Facades\DB;

class ComprobanteService
{
    public function listarComprobantes($request = null)
    {
        $query = Comprobante::with([
            'cliente:id,nombre,telefono,correo',
            'tipoComprobante:id,nombre,codigo_sunat,serie',
            'user:id,name',
            'pagos.metodoPago:id,nombre',
            'creditos:id,comprobante_id,fecha,monto,saldo_pendiente,estado',
        ]);

        $query = $this->aplicarFiltros($query, $request);

        $perPage = $request?->per_page ?? 10;

        return [
            'metricas' => $this->obtenerMetricas($request),
            'comprobantes' => $query->orderBy('id', 'desc')->paginate($perPage),
        ];
    }

    public function obtenerMetricas($request = null): array
    {
        $query = $this->aplicarFiltros(Comprobante::query(), $request);

        $comprobanteIds = (clone $query)->pluck('id');
        $totalComprobantes = (clone $query)->count();

        $ventasActivas = (clone $query)->where('estado', '!=', EstadoComprobanteEnum::ANULADO->value);
        $totalVentas = (float) (clone $ventasActivas)->sum('total');

        $totalContado = (float) (clone $ventasActivas)
            ->where('forma_pago', FormaPagoEnum::CONTADO->value)
            ->sum('total');

        $totalCredito = (float) (clone $ventasActivas)
            ->where('forma_pago', FormaPagoEnum::CREDITO->value)
            ->sum('total');

        $totalAnulados = (clone $query)
            ->where('estado', EstadoComprobanteEnum::ANULADO->value)
            ->count();

        $montoAnulado = (float) (clone $query)
            ->where('estado', EstadoComprobanteEnum::ANULADO->value)
            ->sum('total');

        $totalPendienteCobro = (float) ComprobanteCredito::whereIn('comprobante_id', $comprobanteIds)
            ->whereHas('comprobante', function ($q) {
                $q->where('estado', '!=', EstadoComprobanteEnum::ANULADO->value);
            })
            ->sum('saldo_pendiente');

        return [
            'total_ventas' => round($totalVentas, 2),
            'total_comprobantes' => $totalComprobantes,
            'total_contado' => round($totalContado, 2),
            'total_credito' => round($totalCredito, 2),
            'total_pendiente_cobro' => round($totalPendienteCobro, 2),
            'total_anulados' => $totalAnulados,
            'monto_anulado' => round($montoAnulado, 2),
        ];
    }

    public function mostrar($id)
    {
        return Comprobante::with([
            'cliente',
            'tipoComprobante',
            'user:id,name',
            'caja',
            'detalles.producto:id,nombre,codigo_barras,unidad_id',
            'detalles.producto.unidad:id,nombre,abreviatura',
            'pagos.metodoPago:id,nombre',
            'creditos'
        ])->findOrFail($id);
    }

    private function aplicarFiltros($query, $request = null)
    {
        if (!$request) {
            return $query;
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('serie', 'like', "%{$search}%")
                  ->orWhere('correlativo', 'like', "%{$search}%");
            });
        }

        if ($request->filled('tipo_comprobante_id')) {
            $query->where('tipo_comprobante_id', $request->tipo_comprobante_id);
        }

        if ($request->filled('forma_pago')) {
            $query->where('forma_pago', $request->forma_pago);
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('fecha_inicio')) {
            $query->whereDate('fecha_emision', '>=', $request->fecha_inicio);
        }

        if ($request->filled('fecha_fin')) {
            $query->whereDate('fecha_emision', '<=', $request->fecha_fin);
        }

        if ($request->filled('cliente_id')) {
            $query->where('cliente_id', $request->cliente_id);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return $query;
    }
}
