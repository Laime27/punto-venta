import { useState } from "react";
import { filtrosReporteSchema } from "../validations/ReporteValidation";
import type { FiltrosReporteType, PeriodoId } from "../types/ReporteType";

interface Rango {
  fecha_inicio: string;
  fecha_fin: string;
}

const fechaLocal = (fecha: Date) => fecha.toLocaleDateString("en-CA");

const calcularRango = (periodo: PeriodoId): Rango => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth();

  const rangos: Record<PeriodoId, () => [Date, Date]> = {
    hoy: () => [hoy, hoy],
    "7dias": () => [new Date(anio, mes, hoy.getDate() - 6), hoy],
    mes: () => [new Date(anio, mes, 1), hoy],
    "mes-anterior": () => [new Date(anio, mes - 1, 1), new Date(anio, mes, 0)],
    anio: () => [new Date(anio, 0, 1), hoy],
  };

  const [inicio, fin] = rangos[periodo]();
  return { fecha_inicio: fechaLocal(inicio), fecha_fin: fechaLocal(fin) };
};

export const PERIODOS: { id: PeriodoId; nombre: string }[] = [
  { id: "hoy", nombre: "Hoy" },
  { id: "7dias", nombre: "Últimos 7 días" },
  { id: "mes", nombre: "Este mes" },
  { id: "mes-anterior", nombre: "Mes anterior" },
  { id: "anio", nombre: "Este año" },
];

const FILTROS_INICIALES: FiltrosReporteType = {
  ...calcularRango("mes"),
  user_id: null,
  categoria_id: null,
  producto_id: null,
  cliente_id: null,
  solo_stock_bajo: false,
};

export const useReporteFiltros = (alCambiar: () => void) => {
  const [filtros, setFiltros] = useState<FiltrosReporteType>(FILTROS_INICIALES);

  const validacion = filtrosReporteSchema.safeParse(filtros);
  const errorFechas = validacion.success ? null : validacion.error.issues[0]?.message ?? null;

  const periodoActivo = PERIODOS.find(({ id }) => {
    const rango = calcularRango(id);
    return rango.fecha_inicio === filtros.fecha_inicio && rango.fecha_fin === filtros.fecha_fin;
  })?.id;

  const cambiarFiltros = (nuevos: Partial<FiltrosReporteType>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
    alCambiar();
  };

  return {
    valores: filtros,
    periodos: PERIODOS,
    periodoActivo,
    errorFechas,
    cambiarFiltros,
    cambiarPeriodo: (periodo: PeriodoId) => cambiarFiltros(calcularRango(periodo)),
  };
};
