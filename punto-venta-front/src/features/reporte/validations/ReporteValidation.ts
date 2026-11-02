import { z } from "zod";

export const filtrosReporteSchema = z
  .object({
    fecha_inicio: z.string().min(1, "Selecciona la fecha inicial"),
    fecha_fin: z.string().min(1, "Selecciona la fecha final"),
  })
  .refine(({ fecha_inicio, fecha_fin }) => fecha_fin >= fecha_inicio, {
    message: "La fecha final debe ser igual o posterior a la inicial",
    path: ["fecha_fin"],
  });
