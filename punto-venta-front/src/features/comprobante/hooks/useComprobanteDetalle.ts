import { useQuery } from "@tanstack/react-query";
import { obtenerComprobante } from "../services/ComprobanteService";

export const useComprobanteDetalle = (id: number | null) => {
  return useQuery({
    queryKey: ["comprobante-detalle", id],
    queryFn: () => obtenerComprobante(id!),
    enabled: Boolean(id),
  });
};
