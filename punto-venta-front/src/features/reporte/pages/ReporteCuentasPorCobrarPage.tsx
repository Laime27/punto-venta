import { useReporte } from "../hooks/useReporte";
import { ReporteEncabezado } from "../components/ReporteEncabezado";
import { ReporteFiltros } from "../components/ReporteFiltros";
import { ReporteCuentasPorCobrarContenido } from "../components/cuentas-por-cobrar/ReporteCuentasPorCobrarContenido";
import type { CuentaPorCobrarType, ReporteCuentasPorCobrarType } from "../types/ReporteType";

export function ReporteCuentasPorCobrarPage() {
  const { filtros, datos, cargando, detalle, exportacion } = useReporte<ReporteCuentasPorCobrarType, CuentaPorCobrarType>("cuentas-por-cobrar", false);

  return (
    <div className="p-6 space-y-6">
      <ReporteEncabezado
        titulo="Cuentas por cobrar"
        descripcion="Saldos pendientes de los clientes a la fecha, vencidos y por vencer."
        exportacion={exportacion}
      >
        <ReporteFiltros disponibles={{ cliente: true }} filtros={filtros} />
      </ReporteEncabezado>
      <ReporteCuentasPorCobrarContenido datos={datos} cargando={cargando} detalle={detalle} />
    </div>
  );
}
