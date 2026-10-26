import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { listarMetodoPagoTodos } from "@/features/metodopago/services/MetodopagoService";
import type { MetodoPagoType } from "@/features/metodopago/types/MetodopagoType";
import { obtenerEstadoActualCaja } from "@/features/caja/services/CajaService";
import type { CajaEstadoActual } from "@/features/caja/types/CajaType";

export const usePosHook = () => {
  const navigate = useNavigate();

  const { data: listaMetodoPago = [], isLoading } = useQuery<MetodoPagoType[]>({
    queryKey: ["metodosPagoTodos"],
    queryFn: listarMetodoPagoTodos,
  });

  const { data: estadoCaja, isLoading: cargandoCaja } = useQuery<CajaEstadoActual>({
    queryKey: ["caja", "estado-actual"],
    queryFn: obtenerEstadoActualCaja,
  });

  const cajaActiva = Boolean(estadoCaja?.activa);

  const irACaja = () => navigate("/caja");

  return {
    listaMetodoPago,
    isLoading,
    cajaActiva,
    cargandoCaja,
    irACaja,
  };
};
