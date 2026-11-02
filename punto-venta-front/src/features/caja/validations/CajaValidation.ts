import { z } from "zod";

const observaciones = z
  .string()
  .max(500, "Las observaciones no pueden superar los 500 caracteres")
  .optional();

export const AbrirCajaSchema = z.object({
  monto_apertura: z
    .number({ message: "Ingrese un monto válido" })
    .min(0, "El monto de apertura no puede ser negativo"),
  observaciones,
});

export const CerrarCajaSchema = z.object({
  monto_real: z
    .number({ message: "Ingrese el efectivo contado" })
    .min(0, "El monto real no puede ser negativo"),
  observaciones,
});

export const MovimientoCajaSchema = z.object({
  tipo: z.enum(["ingreso", "egreso"], { message: "Selecciona un tipo válido" }),
  monto: z
    .number({ message: "Ingrese un monto válido" })
    .positive("El monto debe ser mayor a 0"),
  motivo: z
    .string()
    .trim()
    .min(1, "El motivo es obligatorio")
    .max(255, "El motivo no puede superar los 255 caracteres"),
  observaciones,
});

export type AbrirCajaFormData = z.infer<typeof AbrirCajaSchema>;
export type CerrarCajaFormData = z.infer<typeof CerrarCajaSchema>;
export type MovimientoCajaFormData = z.infer<typeof MovimientoCajaSchema>;
