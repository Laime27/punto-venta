import { z } from "zod";

export const CategoriaSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
});

export type CategoriaFormData = z.infer<typeof CategoriaSchema>;
