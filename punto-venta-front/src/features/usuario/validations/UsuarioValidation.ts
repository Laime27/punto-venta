import { z } from "zod";

export const crearUsuarioSchema = (esEdicion: boolean) =>
  z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio").max(120, "Máximo 120 caracteres"),
    email: z.string().trim().min(1, "El correo es obligatorio").email("El correo no es válido"),
    password: esEdicion
      ? z.string().refine((valor) => valor === "" || valor.length >= 8, "Debe tener al menos 8 caracteres")
      : z.string().min(8, "Debe tener al menos 8 caracteres"),
    rol_id: z.number({ error: "Selecciona un rol" }).min(1, "Selecciona un rol"),
  });

export type UsuarioFormValues = z.infer<ReturnType<typeof crearUsuarioSchema>>;
