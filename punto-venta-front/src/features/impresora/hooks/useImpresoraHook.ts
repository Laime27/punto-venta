import { useQuery } from "@tanstack/react-query";
import { obtenerImpresora } from "../services/ImpresoraService";
import type { Impresora } from "../types/ImpresoraType";

export const IMPRESORA_QUERY_KEY = ["impresora"];
export const IMPRESORA_STALE_TIME = 1000 * 60 * 30;

// siempreActualizar: la pantalla de configuración pide el dato fresco al entrar; el resto de la app usa la caché
export const useImpresoraHook = ({ siempreActualizar = false } = {}) => {
  const { data: impresora = null, isLoading } = useQuery<Impresora | null>({
    queryKey: IMPRESORA_QUERY_KEY,
    queryFn: obtenerImpresora,
    staleTime: IMPRESORA_STALE_TIME,
    refetchOnMount: siempreActualizar ? "always" : true,
  });

  return {
    impresora,
    isLoading,
  };
};
