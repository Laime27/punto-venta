import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { obtenerOrdenCompraId } from "../../services/OrdenCompraService";

export const useOrdenCompraVer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ordenId = Number(id);

  const { data: ordenCompra, isLoading } = useQuery({
    queryKey: ["ordenCompra", ordenId],
    queryFn: () => obtenerOrdenCompraId(ordenId),
    enabled: !!ordenId,
  });

  const volver = () => {
    navigate("/orden-compra");
  };

  return {
    estado: {
      ordenCompra,
      isLoading,
    },
    funciones: {
      volver,
    },
  };
};
