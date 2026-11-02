import { useReporte } from "../hooks/useReporte";
import { ReporteEncabezado } from "../components/ReporteEncabezado";
import { ReporteFiltros } from "../components/ReporteFiltros";
import { ReporteProductosContenido } from "../components/productos/ReporteProductosContenido";
import type { ProductoRentabilidadType, ReporteProductosType } from "../types/ReporteType";

export function ReporteProductosPage() {
  const { filtros, datos, cargando, detalle, exportacion } = useReporte<ReporteProductosType, ProductoRentabilidadType>("productos", true);

  return (
    <div className="p-6 space-y-6">
      <ReporteEncabezado
        titulo="Rentabilidad de productos"
        descripcion="Unidades, ingresos, costo y utilidad de cada producto vendido."
        exportacion={exportacion}
      >
        <ReporteFiltros disponibles={{ fechas: true, vendedor: true, categoria: true, producto: true }} filtros={filtros} />
      </ReporteEncabezado>
      <ReporteProductosContenido datos={datos} cargando={cargando} detalle={detalle} />
    </div>
  );
}
