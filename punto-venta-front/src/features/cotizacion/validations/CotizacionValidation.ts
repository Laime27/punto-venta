import { z } from "zod";

export const cotizacionFormSchema = z.object({
  cliente_id: z.number().nullable().optional(),
  fecha_emision: z.string().nullable().optional(),
  fecha_vencimiento: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  descuento_global: z.number().optional(),
});

export type CotizacionFormData = z.infer<typeof cotizacionFormSchema>;
