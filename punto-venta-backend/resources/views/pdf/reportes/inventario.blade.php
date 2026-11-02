@extends('pdf.reportes.layout')

@section('contenido')
    @php($ind = $datos['indicadores'])

    @include('pdf.reportes.partials.kpis', ['indicadores' => [
        ['titulo' => 'Valor a costo', 'valor' => $simbolo . ' ' . number_format($ind['valor_costo'], 2)],
        ['titulo' => 'Valor a precio de venta', 'valor' => $simbolo . ' ' . number_format($ind['valor_venta'], 2)],
        ['titulo' => 'Utilidad potencial', 'valor' => $simbolo . ' ' . number_format($ind['utilidad_potencial'], 2), 'tono' => 'positivo'],
        ['titulo' => 'Stock bajo / por agotarse', 'valor' => $ind['productos_stock_bajo'] . ' / ' . $ind['productos_por_agotarse'], 'tono' => $ind['productos_stock_bajo'] > 0 ? 'negativo' : ''],
    ]])

    <div class="seccion">Valor a costo por categoría</div>
    @include('pdf.reportes.partials.barras', ['filas' => $datos['por_categoria'], 'etiqueta' => 'nombre', 'valor' => 'valor_costo'])

    <div class="seccion">Detalle de productos ({{ $ind['total_productos'] }})</div>
    <table class="tabla">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th class="num">Stock</th>
                <th class="num">Mínimo</th>
                <th class="num">P. compra</th>
                <th class="num">Valor costo</th>
                <th class="num">Valor venta</th>
            </tr>
        </thead>
        <tbody>
            @forelse($detalle as $producto)
                <tr>
                    <td>{{ $producto['nombre'] }}</td>
                    <td>{{ $producto['categoria'] }}</td>
                    <td class="num stock-{{ $producto['estado_stock'] }}">{{ number_format($producto['stock'], 2) }}</td>
                    <td class="num">{{ number_format($producto['stock_minimo'], 2) }}</td>
                    <td class="num">{{ $simbolo }} {{ number_format($producto['precio_compra'], 2) }}</td>
                    <td class="num">{{ $simbolo }} {{ number_format($producto['valor_costo'], 2) }}</td>
                    <td class="num">{{ $simbolo }} {{ number_format($producto['valor_venta'], 2) }}</td>
                </tr>
            @empty
                <tr><td colspan="7" class="vacio">No hay productos para los filtros seleccionados.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection
