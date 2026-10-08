import { z } from "zod";

export const MetodoPagoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  tipo: z.enum(['efectivo', 'tarjeta', 'transferencia'], {
    message: "Selecciona un tipo válido"
  }),

});

export type MetodoPagoFormData = z.infer<typeof MetodoPagoSchema>;
