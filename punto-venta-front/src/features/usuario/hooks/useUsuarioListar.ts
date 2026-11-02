import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/lib/errorHandler";
import { listarRolesSelect } from "@/features/rol/services/RolService";
import { cambiarEstadoUsuario, listarUsuarios } from "../services/UsuarioService";
import type { FiltrosUsuarioType, UsuarioType } from "../types/UsuarioType";

const FILTROS_INICIALES: FiltrosUsuarioType = { search: "", rol_id: null, activo: "todos", per_page: 10 };

export const useUsuarioListar = () => {
  const queryClient = useQueryClient();
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosUsuarioType>(FILTROS_INICIALES);
  const [modal, setModal] = useState<{ abierto: boolean; usuario: UsuarioType | null }>({ abierto: false, usuario: null });
  const busqueda = useDebounce(filtros.search, 400);
  const filtrosConsulta = { ...filtros, search: busqueda };

  const { data, isLoading } = useQuery({
    queryKey: ["usuarios", pagina, filtrosConsulta],
    queryFn: () => listarUsuarios(pagina, filtrosConsulta),
    placeholderData: keepPreviousData,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles-select"],
    queryFn: listarRolesSelect,
  });

  const { mutate: cambiarEstado, isPending: cambiandoEstado } = useMutation({
    mutationFn: cambiarEstadoUsuario,
    onSuccess: (usuario) => {
      toast.success(usuario.activo ? "Usuario activado" : "Usuario desactivado");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo cambiar el estado del usuario")),
  });

  const cambiarFiltros = (nuevos: Partial<FiltrosUsuarioType>) => {
    setFiltros((prev) => ({ ...prev, ...nuevos }));
    setPagina(1);
  };

  return {
    datos: {
      usuarios: data?.data ?? [],
      total: data?.total ?? 0,
      isLoading,
      roles,
    },
    paginacion: { pagina, totalPaginas: data?.last_page ?? 1, setPagina },
    filtros: { valores: filtros, cambiarFiltros },
    modal: {
      ...modal,
      abrirNuevo: () => setModal({ abierto: true, usuario: null }),
      abrirEdicion: (usuario: UsuarioType) => setModal({ abierto: true, usuario }),
      cerrar: () => setModal({ abierto: false, usuario: null }),
    },
    estado: { cambiar: cambiarEstado, cambiando: cambiandoEstado },
  };
};
