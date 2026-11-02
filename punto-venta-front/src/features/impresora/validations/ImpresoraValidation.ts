import { z } from "zod";

export const ANCHOS_COMUNES = [80, 58];

export const impresoraSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Debe seleccionar una impresora")
    .max(255, "El nombre no debe superar los 255 caracteres"),
  ancho: z
    .number({ error: "El ancho del papel es obligatorio" })
    .int("El ancho debe ser un número entero"),
});

export type ImpresoraFormValues = z.infer<typeof impresoraSchema>;
