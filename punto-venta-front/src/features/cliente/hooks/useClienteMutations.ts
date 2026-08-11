import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { crearCliente, actualizarCliente, eliminarCliente } from "../services/ClienteService";
import type { ClienteType } from "../types/ClienteType";
import { getErrorMessage } from "@/lib/errorHandler";

interface MutationOptions<T = any> {
  onSuccess?: (data: ClienteType, variables: T) => void;
}

export function useCreateClienteMutation(options?: MutationOptions) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crearCliente,
    onSuccess: (data, variables) => {
      toast.success("Cliente creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear el cliente"));
    },
  });
}

export function useUpdateClienteMutation(options?: MutationOptions<{ id: number; data: any }>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => actualizarCliente(id, data),
    onSuccess: (data, variables) => {
      toast.success("Cliente actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar el cliente"));
    },
  });
}

export function useDeleteClienteMutation(options?: { onSuccess?: (data: any, id: number) => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarCliente(id),
    onSuccess: (data, id) => {
      toast.success("Cliente eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      if (options?.onSuccess) {
        options.onSuccess(data, id);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al eliminar el cliente"));
    },
  });
}
