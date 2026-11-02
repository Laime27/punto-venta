import { z } from "zod";

export const rolSchema = z.object({
  name: z.string().trim().min(1, "El nombre del rol es obligatorio").max(60, "Máximo 60 caracteres"),
  descripcion: z.string().max(255, "Máximo 255 caracteres"),
  permisos: z.array(z.number()).min(1, "Selecciona al menos un permiso"),
});

export type RolFormValues = z.infer<typeof rolSchema>;
