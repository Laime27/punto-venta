@extends('pdf.reportes.layout')

@section('contenido')
    @php($ind = $datos['indicadores'])

    @include('pdf.reportes.partials.kpis', ['indicadores' => [
        ['titulo' => 'Productos vendidos', 'valor' => $ind['productos_vendidos']],
        ['titulo' => 'Ingresos', 'valor' => $simbolo . ' ' . number_format($ind['ingresos'], 2)],
        ['titulo' => 'Utilidad', 'valor' => $simbolo . ' ' . number_format($ind['utilidad'], 2), 'tono' => $ind['utilidad'] >= 0 ? 'positivo' : 'negativo'],
        ['titulo' => 'Margen', 'valor' => number_format($ind['margen'], 1) . '%'],
    ]])

    <div class="seccion">Top 10 por utilidad</div>
    @include('pdf.reportes.partials.barras', ['filas' => $datos['mayor_utilidad'], 'etiqueta' => 'nombre', 'valor' => 'utilidad', 'color' => '#1baf7a'])

    <div class="seccion">Detalle por producto</div>
    <table class="tabla">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th class="num">Cantidad</th>
                <th class="num">Ingresos</th>
                <th class="num">Costo</th>
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
                    <td class="num">{{ $simbolo }} {{ number_format($producto['costo'], 2) }}</td>
                    <td class="num {{ $producto['utilidad'] < 0 ? 'negativo' : 'positivo' }}">{{ $simbolo }} {{ number_format($producto['utilidad'], 2) }}</td>
                    <td class="num">{{ number_format($producto['margen'], 1) }}%</td>
                </tr>
            @empty
                <tr><td colspan="7" class="vacio">Sin ventas en el periodo.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection
