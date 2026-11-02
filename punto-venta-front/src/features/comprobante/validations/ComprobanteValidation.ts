import { z } from "zod";

export const ComprobanteFiltrosSchema = z.object({
  search: z.string().optional(),
  tipo_comprobante_id: z.number().nullable().optional(),
  estado: z.string().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  cliente_id: z.number().nullable().optional(),
  per_page: z.number().optional(),
});

export type ComprobanteFiltrosFormData = z.infer<typeof ComprobanteFiltrosSchema>;
