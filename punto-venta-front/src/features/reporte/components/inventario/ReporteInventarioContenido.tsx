import { useReporteFormato } from "../../hooks/useReporteFormato";
import { useSegmentosGrafico } from "../../hooks/useSegmentosGrafico";
import { ReporteIndicadores } from "../ReporteIndicadores";
import { ReporteTabla } from "../ReporteTabla";
import { ReporteGraficoCard } from "../graficos/ReporteGraficoCard";
import { ReporteGraficoDona } from "../graficos/ReporteGraficoDona";
import { ReporteGraficoBarrasHorizontal } from "../graficos/ReporteGraficoBarrasHorizontal";
import { StockBadge, StockLeyenda } from "@/components/StockBadge";
import type { ColumnaReporte, DetalleReporte, IndicadorReporte, InventarioProductoType, ReporteInventarioType } from "../../types/ReporteType";

interface Props {
  datos?: ReporteInventarioType;
  cargando: boolean;
  detalle: DetalleReporte<InventarioProductoType>;
}

export function ReporteInventarioContenido({ datos, cargando, detalle }: Props) {
  const { moneda, monedaCompacta, numero } = useReporteFormato();
  const ind = datos?.indicadores;

  const porCategoria = useSegmentosGrafico(
    (datos?.por_categoria ?? []).map((categoria) => ({ clave: `categoria-${categoria.id ?? 0}`, nombre: categoria.nombre, valor: categoria.valor_costo }))
  );
  const mayorInversion = (datos?.mayor_inversion ?? []).map((producto) => ({ etiqueta: producto.nombre, valor: producto.valor_costo }));

  const indicadores: IndicadorReporte[] = [
    { titulo: "Valor a costo", valor: moneda(ind?.valor_costo ?? 0), detalle: `${ind?.total_productos ?? 0} productos` },
    { titulo: "Valor a precio de venta", valor: moneda(ind?.valor_venta ?? 0) },
    { titulo: "Utilidad potencial", valor: moneda(ind?.utilidad_potencial ?? 0), tono: "positivo" },
    {
      titulo: "Stock bajo",
      valor: String(ind?.productos_stock_bajo ?? 0),
      detalle: `${ind?.productos_por_agotarse ?? 0} por agotarse`,
      tono: (ind?.productos_stock_bajo ?? 0) > 0 ? "negativo" : "neutro",
    },
  ];

  const columnas: ColumnaReporte<InventarioProductoType>[] = [
    {
      titulo: "Producto",
      celda: (fila) => (
        <div>
          <p className="font-medium">{fila.nombre}</p>
          <p className="text-xs text-muted-foreground">{fila.codigo_barras}</p>
        </div>
      ),
    },
    { titulo: "Categoría", celda: (fila) => fila.categoria },
    { titulo: "Stock", celda: (fila) => <StockBadge stock={fila.stock} stockMinimo={fila.stock_minimo} />, alinear: "right" },
    { titulo: "Mínimo", celda: (fila) => numero(fila.stock_minimo), alinear: "right" },
    { titulo: "P. compra", celda: (fila) => moneda(fila.precio_compra), alinear: "right" },
    { titulo: "Valor costo", celda: (fila) => moneda(fila.valor_costo), alinear: "right" },
    { titulo: "Valor venta", celda: (fila) => moneda(fila.valor_venta), alinear: "right" },
  ];

  return (
    <div className="space-y-6">
      <ReporteIndicadores indicadores={indicadores} cargando={cargando} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ReporteGraficoCard titulo="Valor por categoría" descripcion="A precio de costo" cargando={cargando} vacio={porCategoria.length === 0}>
          <ReporteGraficoDona segmentos={porCategoria} formatear={moneda} />
        </ReporteGraficoCard>
        <ReporteGraficoCard titulo="Productos con mayor inversión" descripcion="Top 10 por valor a costo" cargando={cargando} vacio={mayorInversion.length === 0}>
          <ReporteGraficoBarrasHorizontal datos={mayorInversion} nombreSerie="Valor a costo" formatear={moneda} formatearEje={monedaCompacta} />
        </ReporteGraficoCard>
      </div>

      <ReporteTabla
        titulo="Detalle de productos"
        accion={<StockLeyenda />}
        columnas={columnas}
        filas={detalle.filas}
        claveFila={(fila) => fila.id}
        cargando={detalle.cargando}
        paginacion={detalle.paginacion}
      />
    </div>
  );
}
