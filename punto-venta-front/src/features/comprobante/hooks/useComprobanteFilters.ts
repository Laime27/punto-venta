import { useState } from "react";
import type { FiltrosComprobanteType } from "../types/ComprobanteType";

export const ESTADOS_COMPROBANTE = [
  { id: "todos", nombre: "Todos los estados" },
  { id: "pagado", nombre: "Pagado" },
  { id: "pendiente", nombre: "Pendiente" },
  { id: "anulado", nombre: "Anulado" },
];

export const FORMAS_PAGO_COMPROBANTE = [
  { id: "todos", nombre: "Todas las formas" },
  { id: "contado", nombre: "Contado" },
  { id: "credito", nombre: "Crédito" },
];

export const PERIODOS_COMPROBANTE = [
  { id: "personalizado", nombre: "Personalizado" },
  { id: "hoy", nombre: "Hoy" },
  { id: "ayer", nombre: "Ayer" },
  { id: "ultimos_7_dias", nombre: "Últimos 7 días" },
  { id: "esta_semana", nombre: "Esta semana" },
  { id: "este_mes", nombre: "Este mes" },
  { id: "mes_anterior", nombre: "Mes anterior" },
];

const formatearFechaISO = (d: Date): string => {
  const anio = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

interface UseComprobanteFiltersProps {
  search: string;
  filtros: FiltrosComprobanteType;
  setFiltros: (nuevosFiltros: Partial<FiltrosComprobanteType>) => void;
  onLimpiar: () => void;
}

export function useComprobanteFilters({
  search,
  filtros,
  setFiltros,
  onLimpiar,
}: UseComprobanteFiltersProps) {
  const [periodo, setPeriodo] = useState("personalizado");

  const tieneFiltrosActivos = Boolean(
    search ||
      (filtros.estado && filtros.estado !== "todos") ||
      (filtros.forma_pago && filtros.forma_pago !== "todos") ||
      filtros.fecha_inicio ||
      filtros.fecha_fin ||
      filtros.cliente_id
  );

  const aplicarPeriodo = (valor: string) => {
    setPeriodo(valor);

    if (valor === "personalizado") return;

    const hoy = new Date();
    let fechaInicio = "";
    let fechaFin = "";

    if (valor === "hoy") {
      fechaInicio = formatearFechaISO(hoy);
      fechaFin = formatearFechaISO(hoy);
    } else if (valor === "ayer") {
      const ayer = new Date(hoy);
      ayer.setDate(hoy.getDate() - 1);
      fechaInicio = formatearFechaISO(ayer);
      fechaFin = formatearFechaISO(ayer);
    } else if (valor === "ultimos_7_dias") {
      const hace7 = new Date(hoy);
      hace7.setDate(hoy.getDate() - 6);
      fechaInicio = formatearFechaISO(hace7);
      fechaFin = formatearFechaISO(hoy);
    } else if (valor === "esta_semana") {
      const primerDia = new Date(hoy);
      const dia = hoy.getDay();
      const diff = dia === 0 ? -6 : 1 - dia;
      primerDia.setDate(hoy.getDate() + diff);
      fechaInicio = formatearFechaISO(primerDia);
      fechaFin = formatearFechaISO(hoy);
    } else if (valor === "este_mes") {
      const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      fechaInicio = formatearFechaISO(primerDia);
      fechaFin = formatearFechaISO(hoy);
    } else if (valor === "mes_anterior") {
      const primerDia = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
      const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      fechaInicio = formatearFechaISO(primerDia);
      fechaFin = formatearFechaISO(ultimoDia);
    }

    setFiltros({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
  };

  const cambiarFechaInicio = (fecha: string) => {
    setPeriodo("personalizado");
    setFiltros({ fecha_inicio: fecha });
  };

  const cambiarFechaFin = (fecha: string) => {
    setPeriodo("personalizado");
    setFiltros({ fecha_fin: fecha });
  };

  const handleLimpiar = () => {
    setPeriodo("personalizado");
    onLimpiar();
  };

  return {
    periodo,
    estados: ESTADOS_COMPROBANTE,
    formasPago: FORMAS_PAGO_COMPROBANTE,
    periodos: PERIODOS_COMPROBANTE,
    tieneFiltrosActivos,
    aplicarPeriodo,
    cambiarFechaInicio,
    cambiarFechaFin,
    handleLimpiar,
  };
}
