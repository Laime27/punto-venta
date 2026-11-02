import { useReporte } from "../hooks/useReporte";
import { ReporteEncabezado } from "../components/ReporteEncabezado";
import { ReporteFiltros } from "../components/ReporteFiltros";
import { ReporteVentasContenido } from "../components/ventas/ReporteVentasContenido";
import type { ProductoRentabilidadType, ReporteVentasType } from "../types/ReporteType";

export default function ReporteVentasPage() {
  const { filtros, datos, cargando, detalle, exportacion } = useReporte<ReporteVentasType, ProductoRentabilidadType>("ventas", true);

  return (
    <div className="p-6 space-y-6">
      <ReporteEncabezado
        titulo="Reporte de ventas"
        descripcion="Ventas, utilidad, métodos de pago, categorías y productos más y menos vendidos."
        exportacion={exportacion}
      >
        <ReporteFiltros disponibles={{ fechas: true, vendedor: true }} filtros={filtros} />
      </ReporteEncabezado>
      <ReporteVentasContenido datos={datos} cargando={cargando} detalle={detalle} />
    </div>
  );
}
