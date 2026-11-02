import { useReporteFormato } from "../../hooks/useReporteFormato";
import { useSegmentosGrafico } from "../../hooks/useSegmentosGrafico";
import { ReporteIndicadores } from "../ReporteIndicadores";
import { ReporteProductosTabla } from "../ReporteProductosTabla";
import { ReporteGraficoCard } from "../graficos/ReporteGraficoCard";
import { ReporteGraficoBarras } from "../graficos/ReporteGraficoBarras";
import { ReporteGraficoBarrasHorizontal } from "../graficos/ReporteGraficoBarrasHorizontal";
import { ReporteGraficoDona } from "../graficos/ReporteGraficoDona";
import type { DetalleReporte, IndicadorReporte, ProductoRentabilidadType, ReporteVentasType } from "../../types/ReporteType";

interface Props {
  datos?: ReporteVentasType;
  cargando: boolean;
  detalle: DetalleReporte<ProductoRentabilidadType>;
}

export function ReporteVentasContenido({ datos, cargando, detalle }: Props) {
  const { moneda, monedaCompacta, porcentaje, numero, fecha } = useReporteFormato();
  const ind = datos?.indicadores;
  const porMes = datos?.agrupacion === "mes";

  const metodosPago = useSegmentosGrafico(
    (datos?.metodos_pago ?? []).map((metodo) => ({ clave: `metodo-${metodo.id}`, nombre: metodo.nombre, valor: metodo.total }))
  );
  const categorias = useSegmentosGrafico(
    (datos?.categorias ?? []).map((categoria) => ({ clave: `categoria-${categoria.id ?? 0}`, nombre: categoria.nombre, valor: categoria.total }))
  );
  const periodos = (datos?.periodos ?? []).map((periodo) => ({
    etiqueta: porMes ? periodo.periodo : fecha(periodo.periodo).slice(0, 5),
    valor: periodo.total,
  }));
  const masVendidos = (datos?.mas_vendidos ?? []).map((producto) => ({ etiqueta: producto.nombre, valor: producto.cantidad }));
  const menosVendidos = (datos?.menos_vendidos ?? []).map((producto) => ({ etiqueta: producto.nombre, valor: producto.cantidad }));

  const indicadores: IndicadorReporte[] = [
    { titulo: "Total vendido", valor: moneda(ind?.total_ventas ?? 0), detalle: `${ind?.cantidad_ventas ?? 0} ventas` },
    {
      titulo: "Utilidad bruta",
      valor: moneda(ind?.utilidad_bruta ?? 0),
      detalle: `Margen ${porcentaje(ind?.margen ?? 0)}`,
      tono: (ind?.utilidad_bruta ?? 0) >= 0 ? "positivo" : "negativo",
    },
    { titulo: "Al contado", valor: moneda(ind?.total_contado ?? 0), detalle: `Al crédito: ${moneda(ind?.total_credito ?? 0)}` },
    {
      titulo: "Anuladas",
      valor: moneda(ind?.monto_anulado ?? 0),
      detalle: `${ind?.cantidad_anuladas ?? 0} comprobantes · Descuentos ${moneda(ind?.total_descuentos ?? 0)}`,
      tono: (ind?.cantidad_anuladas ?? 0) > 0 ? "negativo" : "neutro",
    },
  ];

  return (
    <div className="space-y-6">
      <ReporteIndicadores indicadores={indicadores} cargando={cargando} />

      <ReporteGraficoCard
        titulo="Evolución de las ventas"
        descripcion={porMes ? "Total vendido por mes" : "Total vendido por día"}
        cargando={cargando}
        vacio={periodos.length === 0}
      >
        <ReporteGraficoBarras datos={periodos} nombreSerie="Total vendido" formatear={moneda} formatearEje={monedaCompacta} />
      </ReporteGraficoCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ReporteGraficoCard titulo="Ingresos por método de pago" descripcion="Incluye abonos de créditos" cargando={cargando} vacio={metodosPago.length === 0}>
          <ReporteGraficoDona segmentos={metodosPago} formatear={moneda} />
        </ReporteGraficoCard>
        <ReporteGraficoCard titulo="Ventas por categoría" cargando={cargando} vacio={categorias.length === 0}>
          <ReporteGraficoDona segmentos={categorias} formatear={moneda} />
        </ReporteGraficoCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ReporteGraficoCard titulo="Top 10 más vendidos" descripcion="Por unidades vendidas" cargando={cargando} vacio={masVendidos.length === 0}>
          <ReporteGraficoBarrasHorizontal datos={masVendidos} nombreSerie="Unidades" formatear={numero} color="var(--serie-3)" />
        </ReporteGraficoCard>
        <ReporteGraficoCard titulo="Top 10 menos vendidos" descripcion="Productos disponibles con menos unidades vendidas" cargando={cargando} vacio={menosVendidos.length === 0}>
          <ReporteGraficoBarrasHorizontal datos={menosVendidos} nombreSerie="Unidades" formatear={numero} color="var(--serie-2)" />
        </ReporteGraficoCard>
      </div>

      <ReporteProductosTabla titulo="Detalle de productos vendidos" detalle={detalle} />
    </div>
  );
}
