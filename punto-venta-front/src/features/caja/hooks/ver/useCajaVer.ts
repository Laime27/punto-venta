import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { obtenerCajaId } from "../../services/CajaService";
import type { CajaDetalle, CajaResumen, TipoMovimientoCaja } from "../../types/CajaType";

export const useCajaVer = () => {
  const { id } = useParams<{ id: string }>();
  const cajaId = Number(id);
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimientoCaja | "todos">("todos");

  const { data, isLoading } = useQuery({
    queryKey: ["caja", "detalle", cajaId],
    queryFn: () => obtenerCajaId(cajaId),
    enabled: !!cajaId,
  });

  const caja: CajaDetalle | undefined = data?.caja;
  const resumen: CajaResumen | undefined = data?.resumen;

  const movimientos = (caja?.movimientos ?? []).filter(
    (mov) => tipoMovimiento === "todos" || mov.tipo === tipoMovimiento
  );

  return {
    estado: {
      caja,
      resumen,
      movimientos,
      tipoMovimiento,
      isLoading,
    },
    funciones: {
      setTipoMovimiento,
    },
  };
};
