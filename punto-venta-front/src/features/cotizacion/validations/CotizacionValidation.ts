import { z } from "zod";

export const cotizacionFormSchema = z.object({
  cliente_id: z.number().nullable().optional(),
  fecha_emision: z.string().nullable().optional(),
  fecha_vencimiento: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  descuento_global: z.number().optional(),
});

export type CotizacionFormData = z.infer<typeof cotizacionFormSchema>;

export const totalesCotizacionSchema = z
  .object({
    detalles: z
      .array(
        z
          .object({
            precio_unitario: z.number(),
            descuento_unitario: z.number().nullable().optional(),
          })
          .refine(({ precio_unitario, descuento_unitario }) => (descuento_unitario ?? 0) <= precio_unitario, {
            message: "El descuento unitario no puede ser mayor al precio del producto",
          })
      )
      .min(1, "Debe agregar al menos un producto"),
    total: z.number(),
    descuento_global: z.number(),
  })
  .refine(({ total, descuento_global }) => descuento_global <= total, {
    message: "El descuento global no puede ser mayor al subtotal de la cotización",
  });

export const rangoFechasCotizacionSchema = z
  .object({
    fecha_inicio: z.string(),
    fecha_fin: z.string(),
  })
  .refine(({ fecha_inicio, fecha_fin }) => !fecha_inicio || !fecha_fin || fecha_fin >= fecha_inicio, {
    message: "La fecha final debe ser igual o posterior a la inicial",
    path: ["fecha_fin"],
  });
