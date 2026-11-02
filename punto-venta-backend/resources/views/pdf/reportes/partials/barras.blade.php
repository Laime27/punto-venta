@php($maximo = max(1, (float) collect($filas)->max($valor)))
@if(collect($filas)->isEmpty())
    <div class="vacio">Sin datos en el periodo.</div>
@else
    <table class="barras">
        @foreach($filas as $fila)
            <tr>
                <td class="barra-etiqueta">{{ $fila[$etiqueta] }}</td>
                <td>
                    <div class="barra-fondo">
                        <div class="barra" style="width: {{ (float) $fila[$valor] > 0 ? max(1, round((float) $fila[$valor] / $maximo * 100, 1)) : 0 }}%; background: {{ $color ?? '#2a78d6' }};"></div>
                    </div>
                </td>
                <td class="barra-valor">
                    {{ ($moneda ?? true) ? $simbolo . ' ' . number_format($fila[$valor], 2) : number_format($fila[$valor], 2) }}
                    @isset($fila['participacion'])<span class="tenue">({{ number_format($fila['participacion'], 1) }}%)</span>@endisset
                </td>
            </tr>
        @endforeach
    </table>
@endif
