<?php

namespace App\Services\Reporte;

use App\Enums\ReporteEnum;
use App\Exports\ReporteExport;
use App\Exports\ReporteLibroExport;
use App\Services\KardexService;
use Illuminate\Support\Collection;

class ReporteExcelService
{
    private const ESTADOS_STOCK = [
        'bajo' => 'Stock bajo',
        'por_agotarse' => 'Por agotarse',
        'normal' => 'Normal',
    ];

    public function __construct(
        protected ReporteDatosService $reporteDatosService,
        protected KardexService $kardexService
    ) {}

    public function generar(ReporteEnum $reporte, array $filtros): ReporteLibroExport
    {
        $resumen = $this->reporteDatosService->resumen($reporte, $filtros);
        $detalle = $this->reporteDatosService->detalleCompleto($reporte, $filtros);

        return new ReporteLibroExport(match ($reporte) {
            ReporteEnum::VENTAS => $this->hojasVentas($resumen, $detalle),
            ReporteEnum::PRODUCTOS => $this->hojasProductos($resumen, $detalle),
            ReporteEnum::CUENTAS_POR_COBRAR => $this->hojasCuentasPorCobrar($resumen, $detalle),
            ReporteEnum::INVENTARIO => $this->hojasInventario($resumen, $detalle),
            ReporteEnum::PERDIDAS => $this->hojasPerdidas($resumen, $detalle),
        });
    }

    public function kardex(int $productoId, array $filtros): ReporteExport
    {
        $kardex = $this->kardexService->obtenerMovimientosParaExportar($productoId, $filtros);

        return $this->hoja(
            'Kardex',
            ['Fecha', 'Tipo de movimiento', 'Documento', 'Responsable', 'Entrada', 'Salida', 'Saldo', 'Observación'],
            $kardex['movimientos'],
            fn($movimiento) => [
                $movimiento->fecha_emision,
                $movimiento->tipoMovimiento?->nombre,
                $movimiento->documento ? "{$movimiento->documento->serie}-{$movimiento->documento->correlativo}" : '',
                $movimiento->user?->name,
                $movimiento->operacion === '+' ? (float) $movimiento->cantidad : 0,
                $movimiento->operacion === '-' ? (float) $movimiento->cantidad : 0,
                (float) $movimiento->stock_actual,
                $movimiento->observacion,
            ]
        );
    }

    private function hojasVentas(array $resumen, Collection $productos): array
    {
        $ind = $resumen['indicadores'];

        return [
            $this->hojaIndicadores([
                'Total vendido' => $ind['total_ventas'],
                'Cantidad de ventas' => $ind['cantidad_ventas'],
                'Costo de lo vendido' => $ind['costo_ventas'],
                'Utilidad bruta' => $ind['utilidad_bruta'],
                'Margen %' => $ind['margen'],
                'Ventas al contado' => $ind['total_contado'],
                'Ventas al crédito' => $ind['total_credito'],
                'Descuentos' => $ind['total_descuentos'],
                'Ventas anuladas' => $ind['cantidad_anuladas'],
                'Monto anulado' => $ind['monto_anulado'],
            ]),
            $this->hoja('Por periodo', ['Periodo', 'Ventas', 'Total'], $resumen['periodos'],
                fn($fila) => [$fila['periodo'], $fila['cantidad'], $fila['total']]),
            $this->hoja('Métodos de pago', ['Método', 'Operaciones', 'Total', 'Participación %'], $resumen['metodos_pago'],
                fn($fila) => [$fila['nombre'], $fila['operaciones'], $fila['total'], $fila['participacion']]),
            $this->hoja('Categorías', ['Categoría', 'Unidades', 'Total', 'Participación %'], $resumen['categorias'],
                fn($fila) => [$fila['nombre'], $fila['cantidad'], $fila['total'], $fila['participacion']]),
            $this->hoja('Más vendidos', ['Producto', 'Unidades'], $resumen['mas_vendidos'],
                fn($fila) => [$fila['nombre'], $fila['cantidad']]),
            $this->hoja('Menos vendidos', ['Producto', 'Unidades'], $resumen['menos_vendidos'],
                fn($fila) => [$fila['nombre'], $fila['cantidad']]),
            $this->hojaProductos($productos),
        ];
    }

    private function hojasProductos(array $resumen, Collection $productos): array
    {
        $ind = $resumen['indicadores'];

        return [
            $this->hojaIndicadores([
                'Productos vendidos' => $ind['productos_vendidos'],
                'Unidades vendidas' => $ind['unidades_vendidas'],
                'Ingresos' => $ind['ingresos'],
                'Costo' => $ind['costo'],
                'Utilidad' => $ind['utilidad'],
                'Margen %' => $ind['margen'],
            ]),
            $this->hojaProductos($productos),
        ];
    }

    private function hojasCuentasPorCobrar(array $resumen, Collection $clientes): array
    {
        $ind = $resumen['indicadores'];

        return [
            $this->hojaIndicadores([
                'Total por cobrar' => $ind['total_por_cobrar'],
                'Vencido' => $ind['total_vencido'],
                'Por vencer' => $ind['total_por_vencer'],
                'Clientes con deuda' => $ind['clientes_con_deuda'],
                'Clientes con atraso' => $ind['clientes_con_vencidos'],
            ]),
            $this->hoja('Clientes',
                ['Cliente', 'Teléfono', 'Ventas', 'Cuotas pendientes', 'Saldo', 'Vencido', 'Por vencer', 'Vencimiento más antiguo'],
                $clientes,
                fn($fila) => [$fila['cliente'], $fila['telefono'], $fila['ventas'], $fila['cuotas_pendientes'], $fila['saldo'], $fila['saldo_vencido'], $fila['saldo_por_vencer'], $fila['vencimiento_mas_antiguo']]),
        ];
    }

    private function hojasInventario(array $resumen, Collection $productos): array
    {
        $ind = $resumen['indicadores'];

        return [
            $this->hojaIndicadores([
                'Productos' => $ind['total_productos'],
                'Unidades en stock' => $ind['total_unidades'],
                'Valor a costo' => $ind['valor_costo'],
                'Valor a precio de venta' => $ind['valor_venta'],
                'Utilidad potencial' => $ind['utilidad_potencial'],
                'Productos con stock bajo' => $ind['productos_stock_bajo'],
                'Productos por agotarse' => $ind['productos_por_agotarse'],
            ]),
            $this->hoja('Productos',
                ['Producto', 'Código', 'Categoría', 'Stock', 'Stock mínimo', 'Estado', 'Precio compra', 'Precio venta', 'Valor costo', 'Valor venta'],
                $productos,
                fn($fila) => [$fila['nombre'], $fila['codigo_barras'], $fila['categoria'], $fila['stock'], $fila['stock_minimo'], self::ESTADOS_STOCK[$fila['estado_stock']], $fila['precio_compra'], $fila['precio_venta'], $fila['valor_costo'], $fila['valor_venta']]),
            $this->hoja('Por categoría', ['Categoría', 'Productos', 'Valor costo', 'Valor venta'], $resumen['por_categoria'],
                fn($fila) => [$fila['nombre'], $fila['productos'], $fila['valor_costo'], $fila['valor_venta']]),
        ];
    }

    private function hojasPerdidas(array $resumen, Collection $productos): array
    {
        return [
            $this->hoja('Por tipo', ['Tipo', 'Ajustes', 'Unidades', 'Valor'], $resumen['por_tipo'],
                fn($fila) => [$fila['tipo'], $fila['ajustes'], $fila['unidades'], $fila['valor']]),
            $this->hoja('Por producto', ['Producto', 'Código', 'Unidades', 'Valor'], $productos,
                fn($fila) => [$fila['nombre'], $fila['codigo_barras'], $fila['unidades'], $fila['valor']]),
        ];
    }

    private function hojaIndicadores(array $indicadores): ReporteExport
    {
        return $this->hoja('Resumen', ['Indicador', 'Valor'], collect($indicadores),
            fn($valor, $indicador) => [$indicador, $valor]);
    }

    private function hojaProductos(Collection $productos): ReporteExport
    {
        return $this->hoja('Productos',
            ['Producto', 'Código', 'Categoría', 'Cantidad', 'Ingresos', 'Costo', 'Utilidad', 'Margen %'],
            $productos,
            fn($fila) => [$fila['nombre'], $fila['codigo_barras'], $fila['categoria'], $fila['cantidad'], $fila['ingresos'], $fila['costo'], $fila['utilidad'], $fila['margen']]);
    }

    private function hoja(string $titulo, array $encabezados, Collection $filas, callable $mapear): ReporteExport
    {
        return new ReporteExport($titulo, $encabezados, $filas->map($mapear)->values()->all());
    }
}
