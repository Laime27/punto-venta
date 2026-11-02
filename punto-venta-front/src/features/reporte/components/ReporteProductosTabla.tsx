import { cn } from "@/lib/utils";
import { useReporteFormato } from "../hooks/useReporteFormato";
import { ReporteTabla } from "./ReporteTabla";
import type { ColumnaReporte, DetalleReporte, ProductoRentabilidadType } from "../types/ReporteType";

interface Props {
  titulo: string;
  detalle: DetalleReporte<ProductoRentabilidadType>;
}

export function ReporteProductosTabla({ titulo, detalle }: Props) {
  const { moneda, porcentaje, numero } = useReporteFormato();

  const columnas: ColumnaReporte<ProductoRentabilidadType>[] = [
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
    { titulo: "Cantidad", celda: (fila) => numero(fila.cantidad), alinear: "right" },
    { titulo: "Ingresos", celda: (fila) => moneda(fila.ingresos), alinear: "right" },
    { titulo: "Costo", celda: (fila) => moneda(fila.costo), alinear: "right" },
    {
      titulo: "Utilidad",
      celda: (fila) => (
        <span className={cn("font-medium", fila.utilidad < 0 ? "text-red-600" : "text-emerald-600")}>{moneda(fila.utilidad)}</span>
      ),
      alinear: "right",
    },
    { titulo: "Margen", celda: (fila) => porcentaje(fila.margen), alinear: "right" },
  ];

  return (
    <ReporteTabla
      titulo={titulo}
      columnas={columnas}
      filas={detalle.filas}
      claveFila={(fila) => fila.id}
      cargando={detalle.cargando}
      paginacion={detalle.paginacion}
      mensajeVacio="No hay ventas en el periodo seleccionado."
    />
  );
}
