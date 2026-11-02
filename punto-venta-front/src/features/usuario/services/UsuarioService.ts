import axios from "@/lib/axiosConfig";
import type { FiltrosUsuarioType, UsuarioPaginadoType, UsuarioPayload, UsuarioType } from "../types/UsuarioType";

const BASE = "/usuario";

export const listarUsuarios = async (pagina: number, filtros: FiltrosUsuarioType): Promise<UsuarioPaginadoType> => {
  const { data } = await axios.get<UsuarioPaginadoType>(BASE, {
    params: {
      page: pagina,
      per_page: filtros.per_page,
      search: filtros.search || undefined,
      rol_id: filtros.rol_id ?? undefined,
      activo: filtros.activo === "todos" ? undefined : filtros.activo,
    },
  });
  return data;
};

export const crearUsuario = async (payload: UsuarioPayload): Promise<UsuarioType> => {
  const { data } = await axios.post<UsuarioType>(BASE, payload);
  return data;
};

export const actualizarUsuario = async (id: number, payload: UsuarioPayload): Promise<UsuarioType> => {
  const { data } = await axios.put<UsuarioType>(`${BASE}/${id}`, payload);
  return data;
};

export const cambiarEstadoUsuario = async (id: number): Promise<UsuarioType> => {
  const { data } = await axios.patch<UsuarioType>(`${BASE}/${id}/estado`);
  return data;
};
