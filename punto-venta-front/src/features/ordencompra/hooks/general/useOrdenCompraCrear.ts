import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearOrdenCompra } from "../../services/OrdenCompraService";
import type { OrdenCompraCreatePayload } from "../../types/OrdenCompraType";
import { useOrdenCompraDetalles } from "./useOrdenCompraDetalles";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { useFechaHoyEmpresa } from "@/features/empresa/hooks/useFechaHoyEmpresa";
import { z } from "zod";

const headerSchema = z.object({
  proveedor_id: z.number().nullable().optional(),
  fecha_emision: z.string().nullable().optional(),
  fecha_recepcion: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
});

export type HeaderFormData = z.infer<typeof headerSchema>;

export const useOrdenCompraCrear = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hoy = useFechaHoyEmpresa();
  const {
    detalles,
    agregarProducto,
    actualizarCantidad,
    actualizarPrecio,
    eliminarDetalle,
    calcularTotal,
  } = useOrdenCompraDetalles();

  const form = useForm<HeaderFormData>({
    resolver: zodResolver(headerSchema),
    defaultValues: {
      proveedor_id: null,
      fecha_emision: hoy,
      fecha_recepcion: null,
      observaciones: null,
    },
  });

  useEffect(() => {
    if (!form.getFieldState("fecha_emision", form.formState).isDirty) {
      form.setValue("fecha_emision", hoy);
    }
  }, [hoy, form]);

  const { mutateAsync: mutateCrearOrden, isPending: enviando } = useMutation({
    mutationFn: crearOrdenCompra,
    onSuccess: () => {
      toast.success("Orden de compra creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["ordenesCompra"] });
      navigate("/orden-compra");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear la orden de compra"));
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

    await mutateCrearOrden(payload);
  };

  return {
    form,
    detalles,
    enviando,
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
