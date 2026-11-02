import { useQuery } from "@tanstack/react-query";
import { listarZonasHorarias } from "../services/EmpresaService";
import type { ZonaHorariaOpcion } from "../types/EmpresaType";

export const useZonasHorariasHook = () => {
  const { data: zonasHorarias = [], isLoading } = useQuery<ZonaHorariaOpcion[]>({
    queryKey: ["empresa", "zonas-horarias"],
    queryFn: listarZonasHorarias,
    staleTime: Infinity,
  });

  return {
    zonasHorarias,
    cargandoZonas: isLoading,
  };
};
