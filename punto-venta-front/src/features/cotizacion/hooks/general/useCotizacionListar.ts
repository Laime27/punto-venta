import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { listarCotizaciones } from "../../services/CotizacionService";
import { rangoFechasCotizacionSchema } from "../../validations/CotizacionValidation";
import type { CotizacionType, FiltrosCotizacionType } from "../../types/CotizacionType";

const ESTADOS = [
  { id: "todos", nombre: "Todos los estados" },
  { id: "PENDIENTE", nombre: "Pendiente" },
  { id: "ACEPTADA", nombre: "Aceptada" },
  { id: "RECHAZADA", nombre: "Rechazada" },
  { id: "VENCIDA", nombre: "Vencida" },
];

const FILTROS_INICIALES: FiltrosCotizacionType = {
  search: "",
  estado: "todos",
  cliente_id: null,
  fecha_inicio: "",
  fecha_fin: "",
};

export const useCotizacionListar = () => {
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosCotizacionType>(FILTROS_INICIALES);
  const busqueda = useDebounce(filtros.search, 400);
  const filtrosConsulta = { ...filtros, search: busqueda };

  const validacion = rangoFechasCotizacionSchema.safeParse(filtros);
  const errorFechas = validacion.success ? null : validacion.error.issues[0]?.message ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["cotizaciones", page, filtrosConsulta],
    queryFn: () => listarCotizaciones(page, filtrosConsulta),
    enabled: !errorFechas,
    placeholderData: keepPreviousData,
  });

  const cotizaciones: CotizacionType[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  const cambiarFiltros = (nuevos: Partial<FiltrosCotizacionType>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
    setPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    setPage(1);
  };

  const tieneFiltrosActivos =
    Boolean(filtros.search) ||
    filtros.estado !== "todos" ||
    filtros.cliente_id !== null ||
    Boolean(filtros.fecha_inicio) ||
    Boolean(filtros.fecha_fin);

  return {
    data: { cotizaciones, isLoading, total },
    pagination: { page, totalPages, setPage },
    filtros: {
      valores: filtros,
      estados: ESTADOS,
      errorFechas,
      tieneFiltrosActivos,
      cambiarFiltros,
      limpiarFiltros,
    },
  };
};
