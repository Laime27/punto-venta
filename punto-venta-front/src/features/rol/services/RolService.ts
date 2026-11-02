import axios from "@/lib/axiosConfig";
import type { GrupoPermisosType, RolDetalleType, RolListadoType, RolPayload, RolSelectType } from "../types/RolType";

const BASE = "/rol";

export const listarRoles = async (): Promise<RolListadoType[]> => {
  const { data } = await axios.get<RolListadoType[]>(BASE);
  return data;
};

export const listarRolesSelect = async (): Promise<RolSelectType[]> => {
  const { data } = await axios.get<RolSelectType[]>(`${BASE}/listar-select`);
  return data;
};

export const listarGruposPermisos = async (): Promise<GrupoPermisosType[]> => {
  const { data } = await axios.get<GrupoPermisosType[]>(`${BASE}/permisos`);
  return data;
};

export const obtenerRol = async (id: number): Promise<RolDetalleType> => {
  const { data } = await axios.get<RolDetalleType>(`${BASE}/${id}`);
  return data;
};

export const crearRol = async (payload: RolPayload) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

export const actualizarRol = async (id: number, payload: RolPayload) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};

export const eliminarRol = async (id: number) => {
  await axios.delete(`${BASE}/${id}`);
};
