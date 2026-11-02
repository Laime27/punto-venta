import { useReporteFormato } from "../../hooks/useReporteFormato";
import { useSegmentosGrafico } from "../../hooks/useSegmentosGrafico";
import { ReporteIndicadores } from "../ReporteIndicadores";
import { ReporteTabla } from "../ReporteTabla";
import { ReporteGraficoCard } from "../graficos/ReporteGraficoCard";
import { ReporteGraficoDona } from "../graficos/ReporteGraficoDona";
import { ReporteGraficoBarrasHorizontal } from "../graficos/ReporteGraficoBarrasHorizontal";
import type { ColumnaReporte, DetalleReporte, IndicadorReporte, PerdidaProductoType, ReportePerdidasType } from "../../types/ReporteType";

interface Props {
  datos?: ReportePerdidasType;
  cargando: boolean;
  detalle: DetalleReporte<PerdidaProductoType>;
}

export function ReportePerdidasContenido({ datos, cargando, detalle }: Props) {
  const { moneda, monedaCompacta, numero } = useReporteFormato();
  const ind = datos?.indicadores;

  const porTipo = useSegmentosGrafico(
    (datos?.por_tipo ?? []).map((tipo) => ({ clave: `tipo-${tipo.id}`, nombre: tipo.tipo, valor: tipo.valor }))
  );
  const masAfectados = (datos?.mas_afectados ?? []).map((producto) => ({ etiqueta: producto.nombre, valor: producto.valor }));

  const indicadores: IndicadorReporte[] = [
    { titulo: "Valor perdido (a costo)", valor: moneda(ind?.valor_total ?? 0), tono: "negativo" },
    { titulo: "Unidades perdidas", valor: numero(ind?.total_unidades ?? 0) },
    { titulo: "Ajustes registrados", valor: String(ind?.total_ajustes ?? 0) },
    { titulo: "Productos afectados", valor: String(ind?.productos_afectados ?? 0) },
  ];

  const columnas: ColumnaReporte<PerdidaProductoType>[] = [
    {
      titulo: "Producto",
      celda: (fila) => (
        <div>
          <p className="font-medium">{fila.nombre}</p>
          <p className="text-xs text-muted-foreground">{fila.codigo_barras}</p>
        </div>
      ),
    },
    { titulo: "Unidades", celda: (fila) => numero(fila.unidades), alinear: "right" },
    { titulo: "Valor", celda: (fila) => <span className="font-medium text-red-600">{moneda(fila.valor)}</span>, alinear: "right" },
  ];

  return (
    <div className="space-y-6">
      <ReporteIndicadores indicadores={indicadores} cargando={cargando} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_3fr]">
        <ReporteGraficoCard titulo="Pérdida por tipo de ajuste" cargando={cargando} vacio={porTipo.length === 0}>
          <ReporteGraficoDona segmentos={porTipo} formatear={moneda} />
        </ReporteGraficoCard>
        <ReporteGraficoCard titulo="Productos más afectados" descripcion="Top 10 por valor perdido" cargando={cargando} vacio={masAfectados.length === 0}>
          <ReporteGraficoBarrasHorizontal datos={masAfectados} nombreSerie="Valor perdido" formatear={moneda} formatearEje={monedaCompacta} color="var(--serie-8)" />
        </ReporteGraficoCard>
      </div>

      <ReporteTabla
        titulo="Detalle por producto"
        columnas={columnas}
        filas={detalle.filas}
        claveFila={(fila) => fila.id}
        cargando={detalle.cargando}
        paginacion={detalle.paginacion}
        mensajeVacio="Sin pérdidas en el periodo."
      />
    </div>
  );
}
