import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { getErrorMessage } from "@/lib/errorHandler";
import { anularOrdenCompra, listarOrdenesCompra } from "../../services/OrdenCompraService";
import type { OrdenCompraType } from "../../types/OrdenCompraType";

export const useOrdenCompraListar = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const confirmacionAnular = useConfirmDialog();

  const { data, isLoading } = useQuery({
    queryKey: ["ordenesCompra", page],
    queryFn: () => listarOrdenesCompra(page),
  });

  const { mutateAsync: anular } = useMutation({
    mutationFn: anularOrdenCompra,
    onSuccess: () => {
      toast.success("Orden de compra anulada");
      queryClient.invalidateQueries({ queryKey: ["ordenesCompra"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo anular la orden de compra")),
  });

  const confirmarAnulacion = async () => {
    if (confirmacionAnular.idSeleccionado) await anular(confirmacionAnular.idSeleccionado);
  };

  const ordenesCompra: OrdenCompraType[] = data?.data ?? [];
  const totalPages: number = data?.last_page ?? 1;
  const total: number = data?.total ?? 0;

  return {
    data: { ordenesCompra, isLoading, total },
    pagination: { page, totalPages, setPage },
    anulacion: { ...confirmacionAnular, confirmar: confirmarAnulacion },
  };
};
