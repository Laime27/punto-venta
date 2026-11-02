import { useReporteFormato } from "../../hooks/useReporteFormato";
import { ReporteIndicadores } from "../ReporteIndicadores";
import { ReporteProductosTabla } from "../ReporteProductosTabla";
import { ReporteGraficoCard } from "../graficos/ReporteGraficoCard";
import { ReporteGraficoBarrasHorizontal } from "../graficos/ReporteGraficoBarrasHorizontal";
import type { DetalleReporte, IndicadorReporte, ProductoRentabilidadType, ReporteProductosType } from "../../types/ReporteType";

interface Props {
  datos?: ReporteProductosType;
  cargando: boolean;
  detalle: DetalleReporte<ProductoRentabilidadType>;
}

export function ReporteProductosContenido({ datos, cargando, detalle }: Props) {
  const { moneda, monedaCompacta, porcentaje, numero } = useReporteFormato();
  const ind = datos?.indicadores;

  const mayoresIngresos = (datos?.mayores_ingresos ?? []).map((producto) => ({ etiqueta: producto.nombre, valor: producto.ingresos }));
  const mayorUtilidad = (datos?.mayor_utilidad ?? []).map((producto) => ({ etiqueta: producto.nombre, valor: producto.utilidad }));

  const indicadores: IndicadorReporte[] = [
    { titulo: "Ingresos", valor: moneda(ind?.ingresos ?? 0), detalle: `${numero(ind?.unidades_vendidas ?? 0)} unidades vendidas` },
    { titulo: "Costo", valor: moneda(ind?.costo ?? 0) },
    { titulo: "Utilidad", valor: moneda(ind?.utilidad ?? 0), tono: (ind?.utilidad ?? 0) >= 0 ? "positivo" : "negativo" },
    { titulo: "Margen", valor: porcentaje(ind?.margen ?? 0), detalle: `${ind?.productos_vendidos ?? 0} productos vendidos` },
  ];

  return (
    <div className="space-y-6">
      <ReporteIndicadores indicadores={indicadores} cargando={cargando} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ReporteGraficoCard titulo="Mayores ingresos" descripcion="Top 10 por ingresos" cargando={cargando} vacio={mayoresIngresos.length === 0}>
          <ReporteGraficoBarrasHorizontal datos={mayoresIngresos} nombreSerie="Ingresos" formatear={moneda} formatearEje={monedaCompacta} />
        </ReporteGraficoCard>
        <ReporteGraficoCard titulo="Más rentables" descripcion="Top 10 por utilidad" cargando={cargando} vacio={mayorUtilidad.length === 0}>
          <ReporteGraficoBarrasHorizontal datos={mayorUtilidad} nombreSerie="Utilidad" formatear={moneda} formatearEje={monedaCompacta} color="var(--serie-3)" />
        </ReporteGraficoCard>
      </div>

      <ReporteProductosTabla titulo="Detalle por producto" detalle={detalle} />
    </div>
  );
}
