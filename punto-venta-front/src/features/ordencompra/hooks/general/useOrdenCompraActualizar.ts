import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerOrdenCompraId, actualizarOrdenCompra } from "../../services/OrdenCompraService";
import type { OrdenCompraCreatePayload } from "../../types/OrdenCompraType";
import { useOrdenCompraDetalles } from "./useOrdenCompraDetalles";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { z } from "zod";

const headerSchema = z.object({
  proveedor_id: z.number().nullable().optional(),
  fecha_emision: z.string().nullable().optional(),
  fecha_recepcion: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
});

export type HeaderFormData = z.infer<typeof headerSchema>;

export const useOrdenCompraActualizar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const ordenId = Number(id);

  const {
    detalles,
    setDetalles,
    agregarProducto,
    actualizarCantidad,
    actualizarPrecio,
    eliminarDetalle,
    calcularTotal,
  } = useOrdenCompraDetalles();

  const { data: ordenCompra, isLoading: cargandoOrden } = useQuery({
    queryKey: ["ordenCompra", ordenId],
    queryFn: () => obtenerOrdenCompraId(ordenId),
    enabled: !!ordenId,
  });

  const form = useForm<HeaderFormData>({
    resolver: zodResolver(headerSchema),
    defaultValues: {
      proveedor_id: null,
      fecha_emision: "",
      fecha_recepcion: null,
      observaciones: null,
    },
  });

  useEffect(() => {
    if (ordenCompra) {
      if (ordenCompra.estado !== "PENDIENTE") {
        toast.error("Solo se pueden editar órdenes en estado PENDIENTE.");
        navigate("/orden-compra");
        return;
      }
      form.reset({
        proveedor_id: ordenCompra.proveedor_id,
        fecha_emision: ordenCompra.fecha_emision,
        fecha_recepcion: ordenCompra.fecha_recepcion,
        observaciones: ordenCompra.observaciones,
      });

      if (ordenCompra.detalles) {
        setDetalles(ordenCompra.detalles);
      }
    }
  }, [ordenCompra, form, navigate, setDetalles]);

  const { mutateAsync: mutateActualizarOrden, isPending: enviando } = useMutation({
    mutationFn: (payload: OrdenCompraCreatePayload) => actualizarOrdenCompra(ordenId, payload),
    onSuccess: () => {
      toast.success("Orden de compra actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["ordenesCompra"] });
      queryClient.invalidateQueries({ queryKey: ["ordenCompra", ordenId] });
      navigate("/orden-compra");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar la orden de compra"));
    }
  });

  const onSubmit = async (headerData: HeaderFormData) => {
    if (detalles.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }
    
    const payload: OrdenCompraCreatePayload = {
      ...headerData,
      detalles: detalles.map((d) => ({
        producto_id: d.producto_id!,
        cantidad_pedida: d.cantidad_pedida,
        precio_unitario: d.precio_unitario,
      })),
    };

    await mutateActualizarOrden(payload);
  };

  return {
    form,
    detalles,
    enviando,
    cargandoOrden,
    funciones: {
      agregarProducto,
      actualizarCantidad,
      actualizarPrecio,
      eliminarDetalle,
      calcularTotal,
      onSubmit: form.handleSubmit(onSubmit),
    }
  };
};
