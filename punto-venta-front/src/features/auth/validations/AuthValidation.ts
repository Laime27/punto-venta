import { z } from "zod";

export const AuthSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Debe ser un correo válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type AuthFormData = z.infer<typeof AuthSchema>;
