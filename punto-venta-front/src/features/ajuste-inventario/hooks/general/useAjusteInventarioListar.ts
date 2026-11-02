import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { listarAjustesInventario } from "../../services/AjusteInventarioService";
import { TIPOS_AJUSTE } from "../../validations/AjusteInventarioValidation";
import type { AjusteInventarioType, FiltrosAjusteInventario } from "../../types/AjusteInventarioType";

const FILTROS_INICIALES: FiltrosAjusteInventario = {
  tipo_movimiento_id: "todos",
  fecha_inicio: "",
  fecha_fin: "",
  search: "",
};

export const useAjusteInventarioListar = () => {
  const [page, setPage] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosAjusteInventario>(FILTROS_INICIALES);
  const busquedaDebounce = useDebounce(filtros.search, 400);
  const filtrosConsulta = { ...filtros, search: busquedaDebounce };

  const { data, isLoading } = useQuery({
    queryKey: ["ajustesInventario", page, filtrosConsulta],
    queryFn: () => listarAjustesInventario(page, filtrosConsulta),
  });

  const ajustes: AjusteInventarioType[] = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;
  const total = data?.total ?? 0;

  const cambiarFiltros = (nuevos: Partial<FiltrosAjusteInventario>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
    setPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
    setPage(1);
  };

  const tieneFiltrosActivos =
    filtros.tipo_movimiento_id !== "todos" ||
    Boolean(filtros.fecha_inicio) ||
    Boolean(filtros.fecha_fin) ||
    Boolean(filtros.search);

  return {
    data: { ajustes, total, isLoading },
    pagination: { page, totalPages, setPage },
    filtros: {
      valores: filtros,
      tipos: TIPOS_AJUSTE,
      tieneFiltrosActivos,
      cambiarFiltros,
      limpiarFiltros,
    },
  };
};
