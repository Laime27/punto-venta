<table class="kpis">
    @foreach(array_chunk($indicadores, 4) as $fila)
        <tr>
            @foreach($fila as $indicador)
                <td class="kpi">
                    <div class="kpi-titulo">{{ $indicador['titulo'] }}</div>
                    <div class="kpi-valor {{ $indicador['tono'] ?? '' }}">{{ $indicador['valor'] }}</div>
                </td>
            @endforeach
            @for($vacia = count($fila); $vacia < 4; $vacia++)
                <td></td>
            @endfor
        </tr>
    @endforeach
</table>
