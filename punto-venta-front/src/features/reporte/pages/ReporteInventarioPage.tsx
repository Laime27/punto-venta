import { useReporte } from "../hooks/useReporte";
import { ReporteEncabezado } from "../components/ReporteEncabezado";
import { ReporteFiltros } from "../components/ReporteFiltros";
import { ReporteInventarioContenido } from "../components/inventario/ReporteInventarioContenido";
import type { InventarioProductoType, ReporteInventarioType } from "../types/ReporteType";

export function ReporteInventarioPage() {
  const { filtros, datos, cargando, detalle, exportacion } = useReporte<ReporteInventarioType, InventarioProductoType>("inventario", false);

  return (
    <div className="p-6 space-y-6">
      <ReporteEncabezado
        titulo="Inventario valorizado"
        descripcion="Stock actual valorizado a costo y a precio de venta."
        exportacion={exportacion}
      >
        <ReporteFiltros disponibles={{ categoria: true, producto: true, stockBajo: true }} filtros={filtros} />
      </ReporteEncabezado>
      <ReporteInventarioContenido datos={datos} cargando={cargando} detalle={detalle} />
    </div>
  );
}
