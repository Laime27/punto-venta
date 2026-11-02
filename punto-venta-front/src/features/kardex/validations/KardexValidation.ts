import { z } from "zod";

export const filtrosKardexSchema = z
  .object({
    fecha_inicio: z.string(),
    fecha_fin: z.string(),
  })
  .refine(({ fecha_inicio, fecha_fin }) => !fecha_inicio || !fecha_fin || fecha_fin >= fecha_inicio, {
    message: "La fecha final debe ser igual o posterior a la inicial",
    path: ["fecha_fin"],
  });
