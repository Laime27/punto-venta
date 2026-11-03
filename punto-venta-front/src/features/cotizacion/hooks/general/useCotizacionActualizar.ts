import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actualizarCotizacion, obtenerCotizacion } from "../../services/CotizacionService";
import type { CotizacionPayload } from "../../types/CotizacionType";
import { useCotizacionDetalles } from "./useCotizacionDetalles";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { cotizacionFormSchema, totalesCotizacionSchema, type CotizacionFormData } from "../../validations/CotizacionValidation";

export const useCotizacionActualizar = (id: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cotizacion, isLoading } = useQuery({
    queryKey: ["cotizacion", id],
    queryFn: () => obtenerCotizacion(id),
  });

  const {
    detalles,
    setDetalles,
    agregarProducto,
    actualizarCantidad,
    actualizarPrecio,
    actualizarDescuento,
    eliminarDetalle,
    calcularSubtotal,
    calcularTotalDescuento,
    calcularTotal,
  } = useCotizacionDetalles();

  const form = useForm<CotizacionFormData>({
    resolver: zodResolver(cotizacionFormSchema),
    defaultValues: {
      cliente_id: undefined,
      fecha_emision: "",
      fecha_vencimiento: undefined,
      observaciones: undefined,
      descuento_global: 0,
    },
  });

  useEffect(() => {
    if (cotizacion) {
      form.reset({
        cliente_id: cotizacion.cliente_id,
        fecha_emision: cotizacion.fecha_emision ? cotizacion.fecha_emision.split("T")[0] : "",
        fecha_vencimiento: cotizacion.fecha_vencimiento ? cotizacion.fecha_vencimiento.split("T")[0] : null,
        observaciones: cotizacion.observaciones,
        descuento_global: Number(cotizacion.descuento) || 0,
      });

      if (cotizacion.detalles) {
        setDetalles(cotizacion.detalles.map(d => ({
            ...d,
            precio_unitario: Number(d.precio_unitario),
            descuento_unitario: Number(d.descuento_unitario),
        })));
      }
    }
  }, [cotizacion, form, setDetalles]);

  const { mutateAsync: mutateActualizar, isPending: enviando } = useMutation({
    mutationFn: (payload: CotizacionPayload) => actualizarCotizacion(id, payload),
    onSuccess: () => {
      toast.success("Cotización actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
      queryClient.invalidateQueries({ queryKey: ["cotizacion", id] });
      navigate("/cotizacion");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar la cotización"));
    }
  });

  const onSubmit = async (headerData: CotizacionFormData) => {
    const validacion = totalesCotizacionSchema.safeParse({
      detalles,
      total: calcularTotal(),
      descuento_global: headerData.descuento_global ?? 0,
    });

    if (!validacion.success) {
      toast.error(validacion.error.issues[0].message);
      return;
    }
    
    const payload: CotizacionPayload = {
      cliente_id: headerData.cliente_id,
      fecha_emision: headerData.fecha_emision,
      fecha_vencimiento: headerData.fecha_vencimiento,
      observaciones: headerData.observaciones,
      descuento: headerData.descuento_global || 0,
      porcentaje_impuesto: 0,
      detalles: detalles.map((d) => ({
        producto_id: d.producto_id!,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        descuento_unitario: d.descuento_unitario,
      })),
    };

    await mutateActualizar(payload);
  };

  return {
    form,
    detalles,
    enviando,
    isLoading,
    funciones: {
      agregarProducto,
      actualizarCantidad,
      actualizarPrecio,
      actualizarDescuento,
      eliminarDetalle,
      calcularSubtotal,
      calcularTotalDescuento,
      calcularTotal,
      onSubmit: form.handleSubmit(onSubmit),
    }
  };
};
