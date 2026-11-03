import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearCotizacion } from "../../services/CotizacionService";
import type { CotizacionPayload } from "../../types/CotizacionType";
import { useCotizacionDetalles } from "./useCotizacionDetalles";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { useFechaHoyEmpresa } from "@/features/empresa/hooks/useFechaHoyEmpresa";
import {
  cotizacionFormSchema,
  totalesCotizacionSchema,
  type CotizacionFormData,
} from "../../validations/CotizacionValidation";

export const useCotizacionCrear = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hoy = useFechaHoyEmpresa();
  const {
    detalles,
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
      fecha_emision: hoy,
      fecha_vencimiento: undefined,
      observaciones: undefined,
      descuento_global: 0,
    },
  });

  useEffect(() => {
    if (!form.getFieldState("fecha_emision", form.formState).isDirty) {
      form.setValue("fecha_emision", hoy);
    }
  }, [hoy, form]);

  const { mutateAsync: mutateCrear, isPending: enviando } = useMutation({
    mutationFn: crearCotizacion,
    onSuccess: () => {
      toast.success("Cotización creada correctamente");
      queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
      navigate("/cotizacion");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear la cotización"));
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

    await mutateCrear(payload);
  };

  return {
    form,
    detalles,
    enviando,
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
