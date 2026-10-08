import { useQuery } from "@tanstack/react-query";
import { listarMetodoPagoTodos } from "@/features/metodopago/services/MetodopagoService";

export const usePosHook = () => {
  const { data: listaMetodoPago = [] } = useQuery({
    queryKey: ["metodosPagoTodos"],
    queryFn: listarMetodoPagoTodos,
  });

  return {
    listaMetodoPago,
  };
};
