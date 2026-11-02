import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { actualizarUsuario, crearUsuario } from "../services/UsuarioService";
import { crearUsuarioSchema, type UsuarioFormValues } from "../validations/UsuarioValidation";
import type { UsuarioType } from "../types/UsuarioType";

export const useUsuarioFormulario = (usuario: UsuarioType | null, cerrarModal: () => void) => {
  const queryClient = useQueryClient();
  const esEdicion = usuario !== null;

  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(crearUsuarioSchema(esEdicion)),
    defaultValues: {
      name: usuario?.name ?? "",
      email: usuario?.email ?? "",
      password: "",
      rol_id: usuario?.rol?.id ?? 0,
    },
  });

  const { mutateAsync: guardar, isPending: guardando } = useMutation({
    mutationFn: (valores: UsuarioFormValues) => {
      const payload = { ...valores, password: valores.password || undefined };
      return usuario ? actualizarUsuario(usuario.id, payload) : crearUsuario(payload);
    },
    onSuccess: () => {
      toast.success(esEdicion ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      cerrarModal();
    },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo guardar el usuario")),
  });

  return {
    form,
    esEdicion,
    guardando,
    onSubmit: form.handleSubmit((valores) => guardar(valores)),
  };
};
