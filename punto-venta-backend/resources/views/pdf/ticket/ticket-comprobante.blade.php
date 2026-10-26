@php
    $fuente = $anchoMm < 70 ? 7.5 : 9;
    $moneda = $empresa->moneda_simbolo;
    $dinero = fn ($monto) => $moneda . ' ' . number_format((float) $monto, 2);
    $cantidad = fn ($valor) => rtrim(rtrim(number_format((float) $valor, 2, '.', ''), '0'), '.');
    $esCredito = $comprobante->forma_pago === 'credito';
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $comprobante->serie }}-{{ $comprobante->correlativo }}</title>
    <style>
        @page { margin: 0; }
        body { margin: 0; padding: 3mm 3mm 4mm; font-family: "DejaVu Sans", sans-serif; font-size: {{ $fuente }}pt; color: #000; }
        .centro { text-align: center; }
        .derecha { text-align: right; white-space: nowrap; padding-left: 1.5mm; }
        .cantidad { width: 9mm; }
        .negrita { font-weight: bold; }
        .titulo { font-size: {{ $fuente + 3 }}pt; font-weight: bold; }
        .detalle { font-size: {{ $fuente - 1 }}pt; }
        /* Padding en vez de margin: dompdf ignora el margin entre un div vacío y una tabla */
        .separador { height: 0; padding-top: 3mm; margin-bottom: 3mm; border-bottom: 1px dashed #000; }
        .logo { max-width: 60%; max-height: 18mm; margin-bottom: 1mm; }
        .anulado { border: 2px solid #000; padding: 1.5mm; font-weight: bold; font-size: {{ $fuente + 2 }}pt; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 0.5mm 0; vertical-align: top; }    </style>
</head>
<body>
    <div class="centro">
        @if($logoBase64)
            <img src="{{ $logoBase64 }}" class="logo" alt="logo">
        @endif
        <div class="titulo">{{ $empresa->nombre }}</div>
        @if($empresa->ruc)<div>RUC: {{ $empresa->ruc }}</div>@endif
        @if($empresa->direccion)<div>{{ $empresa->direccion }}</div>@endif
        @if($empresa->telefono)<div>Tel: {{ $empresa->telefono }}</div>@endif
    </div>

    <div class="separador"></div>

    <div class="centro negrita">{{ mb_strtoupper($comprobante->tipoComprobante?->nombre ?? 'Comprobante') }}</div>
    <div class="centro titulo">{{ $comprobante->serie }}-{{ $comprobante->correlativo }}</div>

    @if($comprobante->estado === 'anulado')
        <div class="centro anulado" style="margin-top: 2mm;">ANULADO</div>
    @endif

    <div class="separador"></div>

    <table>
        <tr><td>Fecha:</td><td class="derecha">{{ ($comprobante->fecha_emision ? \Illuminate\Support\Carbon::parse($comprobante->fecha_emision) : $comprobante->created_at)->format('d/m/Y H:i') }}</td></tr>
        @if($comprobante->user)
            <tr><td>Cajero:</td><td class="derecha">{{ $comprobante->user->name }}</td></tr>
        @endif
        <tr><td>Cliente:</td><td class="derecha">{{ $comprobante->cliente?->nombre ?? 'Cliente General' }}</td></tr>
        @if($comprobante->cliente && !$comprobante->cliente->es_sistema && $comprobante->cliente->direccion)
            <tr><td>Dirección:</td><td class="derecha">{{ $comprobante->cliente->direccion }}</td></tr>
        @endif
        <tr><td>Forma de pago:</td><td class="derecha">{{ $esCredito ? 'Crédito' : 'Contado' }}</td></tr>
    </table>

    <div class="separador"></div>

    <table>
        <tr class="negrita"><td class="cantidad">Cant.</td><td>Producto</td><td class="derecha">Total</td></tr>
        @foreach($comprobante->detalles as $detalle)
            <tr>
                <td>{{ $cantidad($detalle->cantidad) }}</td>
                <td>
                    {{ $detalle->producto?->nombre ?? 'Producto' }}
                    <div class="detalle">{{ $cantidad($detalle->cantidad) }} {{ $detalle->producto?->unidad?->abreviatura }} x {{ $dinero($detalle->precio_unitario) }}</div>
                </td>
                <td class="derecha">{{ $dinero($detalle->subtotal) }}</td>
            </tr>
        @endforeach
    </table>

    <div class="separador"></div>

    <table>
        <tr><td>Subtotal</td><td class="derecha">{{ $dinero($comprobante->subtotal) }}</td></tr>
        @if((float) $comprobante->descuento > 0)
            <tr><td>Descuento</td><td class="derecha">- {{ $dinero($comprobante->descuento) }}</td></tr>
        @endif
        <tr class="titulo"><td>TOTAL</td><td class="derecha">{{ $dinero($comprobante->total) }}</td></tr>
    </table>

    @if($comprobante->pagos->isNotEmpty())
        <div class="separador"></div>

        <table>
            @foreach($comprobante->pagos as $pago)
                <tr><td>{{ $pago->metodoPago?->nombre ?? 'Pago' }}</td><td class="derecha">{{ $dinero($pago->monto) }}</td></tr>
            @endforeach
            @if($vuelto > 0)
                <tr class="negrita"><td>Vuelto</td><td class="derecha">{{ $dinero($vuelto) }}</td></tr>
            @endif
        </table>
    @endif

    @if($esCredito)
        <div class="separador"></div>

        <table>
            <tr class="negrita"><td>Saldo pendiente</td><td class="derecha">{{ $dinero($saldoPendiente) }}</td></tr>
        </table>
    @endif

    <div class="separador"></div>

    <div class="centro">¡Gracias por su compra!</div>
</body>
</html>
