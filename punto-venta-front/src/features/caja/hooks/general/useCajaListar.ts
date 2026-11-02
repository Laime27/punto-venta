import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listarCajas } from "../../services/CajaService";
import { useCajaEstado } from "./useCajaEstado";
import type { Caja, FiltrosCaja } from "../../types/CajaType";

export const ESTADOS_CAJA = [
  { id: "todos", nombre: "Todos los estados" },
  { id: "abierta", nombre: "Abierta" },
  { id: "cerrada", nombre: "Cerrada" },
];

const FILTROS_INICIALES: FiltrosCaja = {
  estado: "todos",
  fecha_inicio: "",
  fecha_fin: "",
  per_page: 10,
};

export const useCajaListar = () => {
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosCaja>(FILTROS_INICIALES);
  const { cajaActiva, isLoading: cargandoEstado } = useCajaEstado();

  const { data, isLoading } = useQuery({
    queryKey: ["caja", "listado", page, filtros],
    queryFn: () => listarCajas(page, filtros),
  });

  const cajas: Caja[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  const cambiarFiltros = (nuevos: Partial<FiltrosCaja>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
    setPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    setPage(1);
  };

  const tieneFiltrosActivos =
    filtros.estado !== "todos" || Boolean(filtros.fecha_inicio) || Boolean(filtros.fecha_fin);

  return {
    data: { cajas, total, isLoading, puedeAbrirCaja: !cargandoEstado && !cajaActiva },
    pagination: { page, totalPages, setPage },
    filtros: {
      valores: filtros,
      estados: ESTADOS_CAJA,
      tieneFiltrosActivos,
      cambiarFiltros,
      limpiarFiltros,
    },
  };
};
