import { z } from "zod";

export const ClienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  correo: z
    .string()
    .email("Correo inválido")
    .or(z.literal(""))
    .nullable()
    .optional(),
  telefono: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  nota: z
    .string()
    .max(255, "La nota no puede exceder los 255 caracteres")
    .nullable()
    .optional(),
});

export type ClienteFormData = z.infer<typeof ClienteSchema>;
