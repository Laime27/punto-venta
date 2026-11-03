import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerOrdenCompraId, recibirOrdenCompra } from "../../services/OrdenCompraService";
import { ordenCompraRecibirSchema } from "../../validations/OrdenCompraValidation";
import type { OrdenCompraDetalleType, OrdenCompraRecibirPayload } from "../../types/OrdenCompraType";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { z } from "zod";

type FormData = z.infer<typeof ordenCompraRecibirSchema>;

export const useOrdenCompraRecibir = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const ordenId = Number(id);

  const { data: ordenCompra, isLoading } = useQuery({
    queryKey: ["ordenCompra", ordenId],
    queryFn: () => obtenerOrdenCompraId(ordenId),
    enabled: !!ordenId,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(ordenCompraRecibirSchema),
    defaultValues: { detalles: [] },
  });

  const { fields, replace } = useFieldArray({ control: form.control, name: "detalles" });

  useEffect(() => {
    if (ordenCompra?.detalles) {
      replace(
        ordenCompra.detalles.map((d: OrdenCompraDetalleType) => ({
          id: Number(d.id),
          cantidad_recibida: Number(d.cantidad_recibida ?? 0),
          precio_unitario: Number(d.precio_unitario),
        }))
      );
    }
  }, [ordenCompra, replace]);

  const detallesForm = form.watch("detalles");
  const totalRealCalculado = detallesForm?.reduce((acumulado, detalle) => {
    return acumulado + (Number(detalle.cantidad_recibida || 0) * Number(detalle.precio_unitario || 0));
  }, 0) || 0;

  const { mutateAsync: mutateRecibirOrden, isPending: enviando } = useMutation({
    mutationFn: (data: FormData) => recibirOrdenCompra(ordenId, data as OrdenCompraRecibirPayload),
    onSuccess: () => {
      toast.success("Orden de compra recibida correctamente");
      queryClient.invalidateQueries({ queryKey: ["ordenesCompra"] });
      queryClient.invalidateQueries({ queryKey: ["ordenCompra", ordenId] });
      navigate("/orden-compra");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al recibir la orden de compra"));
    }
  });

  const onSubmit = async (data: FormData) => {
    await mutateRecibirOrden(data);
  };

  const cancelar = () => {
    navigate("/orden-compra");
  };

  return {
    estado: {
      ordenCompra,
      isLoading,
      fields,
      formErrors: form.formState.errors,
      isSubmitting: enviando || form.formState.isSubmitting,
      totalRealCalculado,
    },
    funciones: {
      register: form.register,
      handleSubmit: form.handleSubmit(onSubmit),
      cancelar,
    },
  };
};
