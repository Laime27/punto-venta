@extends('pdf.reportes.layout')

@section('contenido')
    @php($ind = $datos['indicadores'])

    @include('pdf.reportes.partials.kpis', ['indicadores' => [
        ['titulo' => 'Total vendido', 'valor' => $simbolo . ' ' . number_format($ind['total_ventas'], 2)],
        ['titulo' => 'Cantidad de ventas', 'valor' => $ind['cantidad_ventas']],
        ['titulo' => 'Utilidad bruta', 'valor' => $simbolo . ' ' . number_format($ind['utilidad_bruta'], 2), 'tono' => $ind['utilidad_bruta'] >= 0 ? 'positivo' : 'negativo'],
        ['titulo' => 'Margen', 'valor' => number_format($ind['margen'], 1) . '%'],
        ['titulo' => 'Ventas al contado', 'valor' => $simbolo . ' ' . number_format($ind['total_contado'], 2)],
        ['titulo' => 'Ventas al crédito', 'valor' => $simbolo . ' ' . number_format($ind['total_credito'], 2)],
        ['titulo' => 'Descuentos', 'valor' => $simbolo . ' ' . number_format($ind['total_descuentos'], 2), 'tono' => $ind['total_descuentos'] > 0 ? 'alerta' : ''],
        ['titulo' => 'Anuladas', 'valor' => $ind['cantidad_anuladas'] . ' · ' . $simbolo . ' ' . number_format($ind['monto_anulado'], 2), 'tono' => $ind['cantidad_anuladas'] > 0 ? 'negativo' : ''],
    ]])

    <div class="seccion">Evolución de las ventas</div>
    @include('pdf.reportes.partials.barras', ['filas' => $datos['periodos'], 'etiqueta' => 'periodo', 'valor' => 'total'])

    <table class="columnas">
        <tr>
            <td>
                <div class="seccion">Ingresos por método de pago</div>
                @include('pdf.reportes.partials.barras', ['filas' => $datos['metodos_pago'], 'etiqueta' => 'nombre', 'valor' => 'total', 'color' => '#1baf7a'])
            </td>
            <td>
                <div class="seccion">Ventas por categoría</div>
                @include('pdf.reportes.partials.barras', ['filas' => $datos['categorias'], 'etiqueta' => 'nombre', 'valor' => 'total', 'color' => '#6250d6'])
            </td>
        </tr>
    </table>

    <table class="columnas">
        <tr>
            <td>
                <div class="seccion">Top 10 más vendidos (unidades)</div>
                @include('pdf.reportes.partials.barras', ['filas' => $datos['mas_vendidos'], 'etiqueta' => 'nombre', 'valor' => 'cantidad', 'moneda' => false, 'color' => '#1baf7a'])
            </td>
            <td>
                <div class="seccion">Top 10 menos vendidos (unidades)</div>
                @include('pdf.reportes.partials.barras', ['filas' => $datos['menos_vendidos'], 'etiqueta' => 'nombre', 'valor' => 'cantidad', 'moneda' => false, 'color' => '#eb6834'])
            </td>
        </tr>
    </table>

    <div class="seccion">Productos vendidos</div>
    <table class="tabla">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th class="num">Cantidad</th>
                <th class="num">Ingresos</th>
                <th class="num">Utilidad</th>
                <th class="num">Margen</th>
            </tr>
        </thead>
        <tbody>
            @forelse($detalle as $producto)
                <tr>
                    <td>{{ $producto['nombre'] }}</td>
                    <td>{{ $producto['categoria'] }}</td>
                    <td class="num">{{ number_format($producto['cantidad'], 2) }}</td>
                    <td class="num">{{ $simbolo }} {{ number_format($producto['ingresos'], 2) }}</td>
                    <td class="num {{ $producto['utilidad'] < 0 ? 'negativo' : 'positivo' }}">{{ $simbolo }} {{ number_format($producto['utilidad'], 2) }}</td>
                    <td class="num">{{ number_format($producto['margen'], 1) }}%</td>
                </tr>
            @empty
                <tr><td colspan="6" class="vacio">Sin ventas en el periodo.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection
