import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { obtenerReporte } from "../services/ReporteService";
import type { FiltrosReporteType, ReporteId } from "../types/ReporteType";

export const useReporteConsulta = <T>(reporte: ReporteId, filtros: FiltrosReporteType, habilitado: boolean) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["reporte", reporte, filtros],
    queryFn: () => obtenerReporte<T>(reporte, filtros),
    enabled: habilitado,
    placeholderData: keepPreviousData,
  });

  return {
    datos: data,
    cargando: isLoading,
    actualizando: isFetching,
    conError: isError,
  };
};
