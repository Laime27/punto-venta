import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { getErrorMessage } from "@/lib/errorHandler";
import { eliminarRol, listarRoles } from "../services/RolService";

export const useRolListar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirmacion = useConfirmDialog();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: listarRoles,
  });

  const { mutateAsync: eliminar } = useMutation({
    mutationFn: eliminarRol,
    onSuccess: () => {
      toast.success("Rol eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo eliminar el rol")),
  });

  return {
    roles,
    isLoading,
    confirmacion,
    funciones: {
      crear: () => navigate("/roles/crear"),
      editar: (id: number) => navigate(`/roles/${id}/editar`),
      confirmarEliminacion: async () => {
        if (confirmacion.idSeleccionado) await eliminar(confirmacion.idSeleccionado);
      },
    },
  };
};
