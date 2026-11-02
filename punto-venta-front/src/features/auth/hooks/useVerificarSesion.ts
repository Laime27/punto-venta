import { useQuery } from "@tanstack/react-query";
import { getToken, removeToken } from "@/lib/cookie";
import { getAuthMe, SESION_QUERY_KEY } from "../services/AuthService";

export const useVerificarSesion = () => {
  const token = getToken();

  const { data, isLoading, isError } = useQuery({
    queryKey: SESION_QUERY_KEY,
    queryFn: getAuthMe,
    enabled: Boolean(token),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  if (!token || isError) {
    if (isError) removeToken();

    return {
      estaVerificando: false,
      estaAutenticado: false,
      sesion: null,
    };
  }

  return {
    estaVerificando: isLoading,
    estaAutenticado: Boolean(data),
    sesion: data ?? null,
  };
};
