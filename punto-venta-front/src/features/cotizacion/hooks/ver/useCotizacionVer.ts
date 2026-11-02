import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { obtenerCotizacion } from "../../services/CotizacionService";

export const useCotizacionVer = () => {
  const { id } = useParams<{ id: string }>();

  const { data: cotizacion, isLoading } = useQuery({
    queryKey: ["cotizacion", id],
    queryFn: () => obtenerCotizacion(Number(id)),
  });

  return {
    cotizacion,
    isLoading,
  };
};
