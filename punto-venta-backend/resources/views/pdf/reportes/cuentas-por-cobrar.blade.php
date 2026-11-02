@extends('pdf.reportes.layout')

@section('contenido')
    @php($ind = $datos['indicadores'])

    @include('pdf.reportes.partials.kpis', ['indicadores' => [
        ['titulo' => 'Total por cobrar', 'valor' => $simbolo . ' ' . number_format($ind['total_por_cobrar'], 2)],
        ['titulo' => 'Vencido', 'valor' => $simbolo . ' ' . number_format($ind['total_vencido'], 2), 'tono' => 'negativo'],
        ['titulo' => 'Por vencer', 'valor' => $simbolo . ' ' . number_format($ind['total_por_vencer'], 2), 'tono' => 'alerta'],
        ['titulo' => 'Clientes con deuda', 'valor' => $ind['clientes_con_deuda'] . ' (' . $ind['clientes_con_vencidos'] . ' con atraso)'],
    ]])

    <div class="seccion">Clientes con mayor saldo</div>
    @include('pdf.reportes.partials.barras', ['filas' => $datos['mayores_deudores'], 'etiqueta' => 'cliente', 'valor' => 'saldo', 'color' => '#eb6834'])

    <div class="seccion">Detalle por cliente</div>
    <table class="tabla">
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th class="num">Cuotas</th>
                <th class="num">Saldo</th>
                <th class="num">Vencido</th>
                <th class="num">Por vencer</th>
                <th>Vence desde</th>
            </tr>
        </thead>
        <tbody>
            @forelse($detalle as $cliente)
                <tr>
                    <td>{{ $cliente['cliente'] }}</td>
                    <td>{{ $cliente['telefono'] }}</td>
                    <td class="num">{{ $cliente['cuotas_pendientes'] }}</td>
                    <td class="num"><strong>{{ $simbolo }} {{ number_format($cliente['saldo'], 2) }}</strong></td>
                    <td class="num {{ $cliente['saldo_vencido'] > 0 ? 'negativo' : '' }}">{{ $simbolo }} {{ number_format($cliente['saldo_vencido'], 2) }}</td>
                    <td class="num">{{ $simbolo }} {{ number_format($cliente['saldo_por_vencer'], 2) }}</td>
                    <td>{{ \Illuminate\Support\Carbon::parse($cliente['vencimiento_mas_antiguo'])->format('d/m/Y') }}</td>
                </tr>
            @empty
                <tr><td colspan="7" class="vacio">No hay cuentas pendientes de cobro.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection
