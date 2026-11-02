import { useQuery } from "@tanstack/react-query";
import { obtenerEstadoActualCaja } from "../../services/CajaService";

export const useCajaEstado = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["caja", "estado-actual"],
    queryFn: obtenerEstadoActualCaja,
  });

  return {
    cajaActiva: Boolean(data?.activa),
    isLoading,
  };
};
