import { z } from "zod";

export const TIPOS_LOGO_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
export const TAMANO_MAXIMO_LOGO = 2 * 1024 * 1024;

export const empresaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no debe superar los 255 caracteres"),
  ruc: z
    .string()
    .trim()
    .regex(/^(\d{11})?$/, "El RUC debe tener exactamente 11 dígitos numéricos"),
  telefono: z
    .string()
    .trim()
    .max(20, "El teléfono no debe superar los 20 caracteres"),
  email: z
    .string()
    .trim()
    .max(255, "El email no debe superar los 255 caracteres")
    .refine((valor) => valor === "" || z.email().safeParse(valor).success, "Ingrese un email válido"),
  direccion: z
    .string()
    .trim()
    .max(500, "La dirección no debe superar los 500 caracteres"),
  moneda_simbolo: z
    .string()
    .trim()
    .min(1, "El símbolo de moneda es requerido")
    .max(5, "El símbolo de moneda no debe superar los 5 caracteres"),
  timezone: z.string().min(1, "La zona horaria es requerida"),
  logo: z
    .instanceof(File)
    .refine((archivo) => TIPOS_LOGO_PERMITIDOS.includes(archivo.type), "El logo debe ser una imagen jpg, jpeg, png o webp")
    .refine((archivo) => archivo.size <= TAMANO_MAXIMO_LOGO, "El logo no debe superar los 2MB")
    .nullable(),
  quitar_logo: z.boolean(),
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
