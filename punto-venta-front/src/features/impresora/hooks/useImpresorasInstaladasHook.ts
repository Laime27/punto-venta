import { useQuery } from "@tanstack/react-query";
import { listarImpresorasInstaladas } from "../services/AgenteImpresionService";
import type { ImpresorasInstaladasResponse } from "../types/ImpresoraType";

export const useImpresorasInstaladasHook = () => {
  const { data: impresorasInstaladas = [], isSuccess, isError, isFetching, refetch } = useQuery<ImpresorasInstaladasResponse>({
    queryKey: ["agente-impresion", "impresoras"],
    queryFn: listarImpresorasInstaladas,
    retry: false,
  });

  const refrescar = () => {
    refetch();
  };

  return {
    impresorasInstaladas,
    agenteConectado: isSuccess && !isError,
    verificandoAgente: isFetching,
    refrescar,
  };
};
