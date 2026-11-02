@extends('pdf.reportes.layout')

@section('contenido')
    @php($ind = $datos['indicadores'])

    @include('pdf.reportes.partials.kpis', ['indicadores' => [
        ['titulo' => 'Valor perdido (a costo)', 'valor' => $simbolo . ' ' . number_format($ind['valor_total'], 2), 'tono' => 'negativo'],
        ['titulo' => 'Unidades perdidas', 'valor' => number_format($ind['total_unidades'], 2)],
        ['titulo' => 'Ajustes registrados', 'valor' => $ind['total_ajustes']],
        ['titulo' => 'Productos afectados', 'valor' => $ind['productos_afectados']],
    ]])

    <div class="seccion">Pérdida por tipo de ajuste</div>
    @include('pdf.reportes.partials.barras', ['filas' => $datos['por_tipo'], 'etiqueta' => 'tipo', 'valor' => 'valor', 'color' => '#e34948'])

    <div class="seccion">Detalle por producto</div>
    <table class="tabla">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Código</th>
                <th class="num">Unidades</th>
                <th class="num">Valor</th>
            </tr>
        </thead>
        <tbody>
            @forelse($detalle as $producto)
                <tr>
                    <td>{{ $producto['nombre'] }}</td>
                    <td>{{ $producto['codigo_barras'] }}</td>
                    <td class="num">{{ number_format($producto['unidades'], 2) }}</td>
                    <td class="num negativo">{{ $simbolo }} {{ number_format($producto['valor'], 2) }}</td>
                </tr>
            @empty
                <tr><td colspan="4" class="vacio">Sin pérdidas en el periodo.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection
