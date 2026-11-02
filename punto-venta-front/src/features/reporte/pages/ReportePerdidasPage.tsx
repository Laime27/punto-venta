import { useReporte } from "../hooks/useReporte";
import { ReporteEncabezado } from "../components/ReporteEncabezado";
import { ReporteFiltros } from "../components/ReporteFiltros";
import { ReportePerdidasContenido } from "../components/perdidas/ReportePerdidasContenido";
import type { PerdidaProductoType, ReportePerdidasType } from "../types/ReporteType";

export function ReportePerdidasPage() {
  const { filtros, datos, cargando, detalle, exportacion } = useReporte<ReportePerdidasType, PerdidaProductoType>("perdidas", true);

  return (
    <div className="p-6 space-y-6">
      <ReporteEncabezado
        titulo="Pérdidas de inventario"
        descripcion="Pérdidas, daños y faltantes de recuento valorizados a costo."
        exportacion={exportacion}
      >
        <ReporteFiltros disponibles={{ fechas: true }} filtros={filtros} />
      </ReporteEncabezado>
      <ReportePerdidasContenido datos={datos} cargando={cargando} detalle={detalle} />
    </div>
  );
}
