@php
    $fuente = $anchoMm < 70 ? 7.5 : 9;
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ticket de prueba</title>
    <style>
        @page { margin: 0; }
        body { margin: 0; padding: 3mm 3mm 4mm; font-family: "DejaVu Sans", sans-serif; font-size: {{ $fuente }}pt; color: #000; }
        .centro { text-align: center; }
        .derecha { text-align: right; white-space: nowrap; padding-left: 1.5mm; }
        .cantidad { width: 9mm; }
        .negrita { font-weight: bold; }
        .titulo { font-size: {{ $fuente + 3 }}pt; font-weight: bold; }
        .separador { border-top: 1px dashed #000; margin: 2mm 0; }
        .logo { max-width: 60%; max-height: 18mm; margin-bottom: 1mm; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 0.5mm 0; vertical-align: top; }
        .borde { border: 1px solid #000; padding: 1.5mm; }
    </style>
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

    <div class="centro titulo">TICKET DE PRUEBA</div>
    <div class="centro">{{ $fecha->format('d/m/Y H:i:s') }}</div>

    <div class="separador"></div>

    <table>
        <tr><td>Impresora:</td><td class="derecha negrita">{{ $nombreImpresora }}</td></tr>
        <tr><td>Ancho de papel:</td><td class="derecha negrita">{{ $anchoMm }} mm</td></tr>
    </table>

    <div class="separador"></div>

    <table>
        <tr class="negrita"><td class="cantidad">Cant.</td><td>Producto</td><td class="derecha">Total</td></tr>
        <tr><td>2</td><td>Producto de ejemplo</td><td class="derecha">{{ $empresa->moneda_simbolo }} 10.00</td></tr>
        <tr><td>1</td><td>Otro producto con un nombre más largo</td><td class="derecha">{{ $empresa->moneda_simbolo }} 25.50</td></tr>
    </table>

    <div class="separador"></div>

    <table>
        <tr class="titulo"><td>TOTAL</td><td class="derecha">{{ $empresa->moneda_simbolo }} 35.50</td></tr>
    </table>

    <div class="separador"></div>

    <div class="borde centro">
        Si este recuadro se ve completo, el ancho está bien configurado.
    </div>

    <div class="centro" style="margin-top: 2mm;">¡La impresora funciona correctamente!</div>
</body>
</html>
