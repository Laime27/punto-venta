import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { obtenerAjusteInventario } from "../../services/AjusteInventarioService";

export const useAjusteInventarioVer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ajusteId = Number(id);

  const { data: ajuste, isLoading } = useQuery({
    queryKey: ["ajusteInventario", ajusteId],
    queryFn: () => obtenerAjusteInventario(ajusteId),
    enabled: !!ajusteId,
  });

  const detalles = ajuste?.detalles ?? [];
  const valorPerdido = detalles.reduce((acc, d) => {
    const diferencia = Number(d.diferencia);
    return diferencia < 0 ? acc + Math.abs(diferencia) * Number(d.costo_unitario) : acc;
  }, 0);

  return {
    estado: { ajuste, detalles, valorPerdido, isLoading },
    funciones: {
      volver: () => navigate("/ajuste-inventario"),
    },
  };
};
