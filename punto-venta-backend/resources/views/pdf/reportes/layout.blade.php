<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $titulo }}</title>
    <style>
        @page { margin: 28px 32px 40px 32px; }
        body { font-family: "DejaVu Sans", sans-serif; font-size: 10px; color: #1f2937; }
        .encabezado { width: 100%; border-bottom: 2px solid #2a78d6; padding-bottom: 10px; margin-bottom: 16px; }
        .encabezado td { vertical-align: top; }
        .empresa { font-size: 15px; font-weight: bold; color: #111827; }
        .tenue { color: #6b7280; }
        .titulo { font-size: 17px; font-weight: bold; color: #2a78d6; text-align: right; }
        .derecha { text-align: right; }
        .kpis { width: 100%; border-collapse: separate; border-spacing: 6px; margin: 0 -6px 12px -6px; }
        .kpi { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; width: 25%; }
        .kpi-titulo { font-size: 8.5px; color: #6b7280; text-transform: uppercase; }
        .kpi-valor { font-size: 14px; font-weight: bold; margin-top: 3px; }
        .seccion { font-size: 12px; font-weight: bold; margin: 16px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; }
        .barras { width: 100%; border-collapse: collapse; }
        .barras td { padding: 3px 0; vertical-align: middle; }
        .barra-etiqueta { width: 32%; padding-right: 8px !important; }
        .barra-fondo { background: #f3f4f6; height: 12px; border-radius: 3px; }
        .barra { height: 12px; border-radius: 3px; }
        .barra-valor { width: 22%; text-align: right; padding-left: 8px !important; white-space: nowrap; }
        .tabla { width: 100%; border-collapse: collapse; }
        .tabla th { background: #f3f4f6; text-align: left; padding: 6px; font-size: 9px; text-transform: uppercase; color: #4b5563; }
        .tabla td { padding: 5px 6px; border-bottom: 1px solid #f0f0f0; }
        .tabla .num { text-align: right; }
        .positivo { color: #0f7a3d; }
        .negativo { color: #c62828; }
        .alerta { color: #b45309; }
        .stock-bajo { color: #c62828; font-weight: bold; }
        .stock-por_agotarse { color: #b45309; font-weight: bold; }
        .stock-normal { color: #0f7a3d; }
        .vacio { text-align: center; color: #9ca3af; padding: 14px; }
        .columnas { width: 100%; }
        .columnas > tbody > tr > td { width: 50%; vertical-align: top; }
        .columnas > tbody > tr > td:first-child { padding-right: 10px; }
        .columnas > tbody > tr > td:last-child { padding-left: 10px; }
        .pie { position: fixed; bottom: -24px; left: 0; right: 0; font-size: 8px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <table class="encabezado">
        <tr>
            <td>
                <div class="empresa">{{ $empresa->nombre }}</div>
                @if($empresa->ruc)<div class="tenue">RUC: {{ $empresa->ruc }}</div>@endif
                @if($empresa->direccion)<div class="tenue">{{ $empresa->direccion }}</div>@endif
            </td>
            <td class="derecha">
                <div class="titulo">{{ $titulo }}</div>
                <div>{{ $periodo }}</div>
                @if($vendedor)<div class="tenue">Vendedor: {{ $vendedor }}</div>@endif
            </td>
        </tr>
    </table>

    @yield('contenido')

    <div class="pie">Generado el {{ $generado }} · {{ $empresa->nombre }}</div>
</body>
</html>
