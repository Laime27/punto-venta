import { z } from "zod";

export const AuthSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Debe ser un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type AuthFormData = z.infer<typeof AuthSchema>;
