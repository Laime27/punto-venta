import { useQuery } from "@tanstack/react-query";
import { obtenerEmpresa } from "../services/EmpresaService";
import type { Empresa } from "../types/EmpresaType";

export const EMPRESA_QUERY_KEY = ["empresa"];

export const useEmpresaHook = () => {
  const { data: empresa, isLoading } = useQuery<Empresa>({
    queryKey: EMPRESA_QUERY_KEY,
    queryFn: obtenerEmpresa,
    staleTime: 1000 * 60 * 30,
  });

  return {
    empresa,
    isLoading,
  };
};
