import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { listarHistorial, listarTiposMovimiento } from "../services/HistorialMovimientoService";
import { rangoFechasHistorialSchema } from "../validations/HistorialMovimientoValidation";
import type { FiltrosHistorialType, HistorialMovimientoType } from "../types/HistorialMovimientoType";

const FILTROS_INICIALES: FiltrosHistorialType = {
  per_page: 10,
  search: "",
  tipo_movimiento_id: "todos",
  operacion: "todos",
  fecha_inicio: "",
  fecha_fin: "",
};

export const useHistorialMovimientoHook = () => {
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosHistorialType>(FILTROS_INICIALES);
  const busquedaDebounce = useDebounce(filtros.search, 400);
  const filtrosConsulta = { ...filtros, search: busquedaDebounce };

  const validacionFechas = rangoFechasHistorialSchema.safeParse(filtros);
  const errorFechas = validacionFechas.success ? null : validacionFechas.error.issues[0]?.message ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["historial-movimiento", pagina, filtrosConsulta],
    queryFn: () => listarHistorial(pagina, filtrosConsulta),
    enabled: !errorFechas,
  });

  const { data: tipos = [] } = useQuery({
    queryKey: ["tipos-movimiento"],
    queryFn: listarTiposMovimiento,
    staleTime: Infinity,
  });

  const historial: HistorialMovimientoType[] = data?.data.data ?? [];
  const totalPaginas = data?.data.last_page ?? 1;
  const total = data?.data.total ?? 0;

  const cambiarFiltros = (nuevos: Partial<FiltrosHistorialType>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setFiltros((prev) => ({ ...FILTROS_INICIALES, per_page: prev.per_page }));
    setPagina(1);
  };

  const tieneFiltrosActivos =
    Boolean(filtros.search) ||
    filtros.tipo_movimiento_id !== "todos" ||
    filtros.operacion !== "todos" ||
    Boolean(filtros.fecha_inicio) ||
    Boolean(filtros.fecha_fin);

  return {
    datos: { historial, isLoading, total },
    paginacion: { pagina, totalPaginas, setPagina },
    filtros: {
      valores: filtros,
      tipos,
      errorFechas,
      tieneFiltrosActivos,
      cambiarFiltros,
      limpiarFiltros,
    },
  };
};
