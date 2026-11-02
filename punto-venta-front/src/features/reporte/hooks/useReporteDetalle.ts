import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { obtenerDetalleReporte } from "../services/ReporteService";
import type { FiltrosReporteType, PaginacionTabla, ReporteId } from "../types/ReporteType";

export const OPCIONES_POR_PAGINA = [10, 15, 20, 50];

interface EstadoPaginacion {
  pagina: number;
  porPagina: number;
  setPagina: (pagina: number) => void;
  setPorPagina: (porPagina: number) => void;
}

export const useReporteDetalle = <T>(
  reporte: ReporteId,
  filtros: FiltrosReporteType,
  habilitado: boolean,
  { pagina, porPagina, setPagina, setPorPagina }: EstadoPaginacion
) => {
  const { data, isFetching } = useQuery({
    queryKey: ["reporte-detalle", reporte, filtros, pagina, porPagina],
    queryFn: () => obtenerDetalleReporte<T>(reporte, filtros, pagina, porPagina),
    enabled: habilitado,
    placeholderData: keepPreviousData,
  });

  const paginacion: PaginacionTabla = {
    pagina,
    porPagina,
    totalPaginas: data?.last_page ?? 1,
    total: data?.total ?? 0,
    opcionesPorPagina: OPCIONES_POR_PAGINA,
    cambiarPagina: setPagina,
    cambiarPorPagina: (valor) => {
      setPorPagina(valor);
      setPagina(1);
    },
  };

  return {
    filas: data?.data ?? [],
    cargando: isFetching && !data,
    paginacion,
  };
};
