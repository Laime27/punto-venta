<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cotización #{{ str_pad($cotizacion->id, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #333; }
        .header { width: 100%; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header table { width: 100%; }
        .header td { vertical-align: top; }
        .title { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .details-table th { background-color: #f2f2f2; }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        .totals-table { width: 40%; float: right; border-collapse: collapse; }
        .totals-table th, .totals-table td { border: 1px solid #ddd; padding: 8px; }
        .totals-table th { background-color: #f2f2f2; text-align: left; }
        .footer { clear: both; margin-top: 40px; font-size: 12px; text-align: center; color: #777; }
        .info-box { background: #f9f9f9; padding: 10px; border: 1px solid #ddd; margin-bottom: 20px; }
    </style>
</head>
<body>

    <div class="header">
        <table>
            <tr>
                <td style="width: 60%;">
                    <!-- Aquí podrías poner el Logo usando url() o public_path() -->
                    <div class="title">MI EMPRESA S.A.C.</div>
                    <div>RUC: 20123456789</div>
                    <div>Dirección: Av. Principal 123, Ciudad</div>
                    <div>Teléfono: (01) 234-5678</div>
                </td>
                <td style="width: 40%; text-align: right;">
                    <h2 style="margin:0; color:#2c3e50;">COTIZACIÓN</h2>
                    <h3 style="margin:5px 0;">#{{ $cotizacion->serie }}-{{ anteponerCeros($cotizacion->correlativo) }}</h3>
                    <div>Fecha Emisión: {{ $cotizacion->fecha_emision->format('d/m/Y') }}</div>
                    @if($cotizacion->fecha_vencimiento)
                        <div>Válido hasta: {{ $cotizacion->fecha_vencimiento->format('d/m/Y') }}</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <div class="info-box">
        <strong>Cliente:</strong> {{ $cotizacion->cliente ? $cotizacion->cliente->nombre : 'Cliente Genérico' }}<br>
        @if($cotizacion->cliente && $cotizacion->cliente->numero_documento)
            <strong>Doc:</strong> {{ $cotizacion->cliente->numero_documento }}<br>
        @endif
        @if($cotizacion->cliente && $cotizacion->cliente->direccion)
            <strong>Dirección:</strong> {{ $cotizacion->cliente->direccion }}<br>
        @endif
        <strong>Estado:</strong> {{ $cotizacion->estado }}
    </div>

    <table class="details-table">
        <thead>
            <tr>
                <th>Cant.</th>
                <th>Descripción</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Dscto.</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($cotizacion->detalles as $detalle)
            <tr>
                <td class="text-center">{{ number_format($detalle->cantidad, 2) }}</td>
                <td>{{ $detalle->producto ? $detalle->producto->nombre : 'Producto Desconocido' }}</td>
                <td class="text-right">{{ number_format($detalle->precio_unitario, 2) }}</td>
                <td class="text-right">{{ number_format($detalle->descuento_unitario, 2) }}</td>
                <td class="text-right">{{ number_format($detalle->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <th>Subtotal</th>
            <td class="text-right">{{ number_format($cotizacion->subtotal, 2) }}</td>
        </tr>
        <tr>
            <th>Descuento</th>
            <td class="text-right">{{ number_format($cotizacion->descuento, 2) }}</td>
        </tr>
        <tr>
            <th>TOTAL</th>
            <td class="text-right"><strong>{{ number_format($cotizacion->total, 2) }}</strong></td>
        </tr>
    </table>

    <div class="footer">
        @if($cotizacion->observaciones)
            <p style="text-align: left;"><strong>Observaciones:</strong><br>{{ nl2br(e($cotizacion->observaciones)) }}</p>
        @endif
    </div>

</body>
</html>
