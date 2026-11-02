import { Badge } from "@/components/ui/badge";
import { useReporteFormato } from "../../hooks/useReporteFormato";
import { ReporteIndicadores } from "../ReporteIndicadores";
import { ReporteTabla } from "../ReporteTabla";
import { ReporteGraficoCard } from "../graficos/ReporteGraficoCard";
import { ReporteGraficoBarrasHorizontal } from "../graficos/ReporteGraficoBarrasHorizontal";
import { ReporteGraficoDona } from "../graficos/ReporteGraficoDona";
import type { SegmentoColoreado } from "../../hooks/useSegmentosGrafico";
import type { ColumnaReporte, CuentaPorCobrarType, DetalleReporte, IndicadorReporte, ReporteCuentasPorCobrarType } from "../../types/ReporteType";

interface Props {
  datos?: ReporteCuentasPorCobrarType;
  cargando: boolean;
  detalle: DetalleReporte<CuentaPorCobrarType>;
}

export function ReporteCuentasPorCobrarContenido({ datos, cargando, detalle }: Props) {
  const { moneda, monedaCompacta, fecha } = useReporteFormato();
  const ind = datos?.indicadores;
  const total = ind?.total_por_cobrar ?? 0;

  const estadoDeuda: SegmentoColoreado[] = [
    { clave: "vencido", nombre: "Vencido", valor: ind?.total_vencido ?? 0, color: "var(--serie-8)" },
    { clave: "por-vencer", nombre: "Por vencer", valor: ind?.total_por_vencer ?? 0, color: "var(--serie-1)" },
  ]
    .filter((segmento) => segmento.valor > 0)
    .map((segmento) => ({ ...segmento, porcentaje: total > 0 ? (segmento.valor / total) * 100 : 0 }));

  const mayoresDeudores = (datos?.mayores_deudores ?? []).map((cliente) => ({ etiqueta: cliente.cliente, valor: cliente.saldo }));

  const indicadores: IndicadorReporte[] = [
    { titulo: "Total por cobrar", valor: moneda(total), detalle: `${ind?.clientes_con_deuda ?? 0} clientes` },
    { titulo: "Vencido", valor: moneda(ind?.total_vencido ?? 0), detalle: `${ind?.clientes_con_vencidos ?? 0} clientes con atraso`, tono: "negativo" },
    { titulo: "Por vencer", valor: moneda(ind?.total_por_vencer ?? 0), tono: "alerta" },
  ];

  const columnas: ColumnaReporte<CuentaPorCobrarType>[] = [
    {
      titulo: "Cliente",
      celda: (fila) => (
        <div>
          <p className="font-medium">{fila.cliente}</p>
          {fila.telefono && <p className="text-xs text-muted-foreground">{fila.telefono}</p>}
        </div>
      ),
    },
    { titulo: "Cuotas", celda: (fila) => fila.cuotas_pendientes, alinear: "right" },
    { titulo: "Saldo", celda: (fila) => <span className="font-semibold">{moneda(fila.saldo)}</span>, alinear: "right" },
    {
      titulo: "Vencido",
      celda: (fila) => <span className={fila.saldo_vencido > 0 ? "font-medium text-red-600" : ""}>{moneda(fila.saldo_vencido)}</span>,
      alinear: "right",
    },
    { titulo: "Por vencer", celda: (fila) => moneda(fila.saldo_por_vencer), alinear: "right" },
    {
      titulo: "Vence desde",
      celda: (fila) =>
        fila.saldo_vencido > 0 ? (
          <Badge variant="destructive">{fecha(fila.vencimiento_mas_antiguo)}</Badge>
        ) : (
          <span className="text-muted-foreground">{fecha(fila.vencimiento_mas_antiguo)}</span>
        ),
      alinear: "center",
    },
  ];

  return (
    <div className="space-y-6">
      <ReporteIndicadores indicadores={indicadores} cargando={cargando} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
        <ReporteGraficoCard titulo="Estado de la deuda" cargando={cargando} vacio={estadoDeuda.length === 0}>
          <ReporteGraficoDona segmentos={estadoDeuda} formatear={moneda} />
        </ReporteGraficoCard>
        <ReporteGraficoCard titulo="Clientes con mayor saldo" descripcion="Top 10" cargando={cargando} vacio={mayoresDeudores.length === 0}>
          <ReporteGraficoBarrasHorizontal datos={mayoresDeudores} nombreSerie="Saldo" formatear={moneda} formatearEje={monedaCompacta} color="var(--serie-2)" />
        </ReporteGraficoCard>
      </div>

      <ReporteTabla
        titulo="Detalle por cliente"
        columnas={columnas}
        filas={detalle.filas}
        claveFila={(fila) => fila.id}
        cargando={detalle.cargando}
        paginacion={detalle.paginacion}
        mensajeVacio="No hay cuentas pendientes de cobro."
      />
    </div>
  );
}
