import axios from "@/lib/axiosConfig";
import type {
  AjusteInventarioCreatePayload,
  AjusteInventarioPaginadoType,
  AjusteInventarioType,
  FiltrosAjusteInventario,
} from "../types/AjusteInventarioType";

const BASE = "/ajuste-inventario";

export const listarAjustesInventario = async (page = 1, filtros: FiltrosAjusteInventario): Promise<AjusteInventarioPaginadoType> => {
  const { data } = await axios.get(BASE, {
    params: {
      page,
      tipo_movimiento_id: filtros.tipo_movimiento_id === "todos" ? undefined : filtros.tipo_movimiento_id,
      fecha_inicio: filtros.fecha_inicio || undefined,
      fecha_fin: filtros.fecha_fin || undefined,
      search: filtros.search || undefined,
    },
  });
  return data;
};

export const obtenerAjusteInventario = async (id: number): Promise<AjusteInventarioType> => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const crearAjusteInventario = async (payload: AjusteInventarioCreatePayload): Promise<AjusteInventarioType> => {
  const { data } = await axios.post(BASE, payload);
  return data;
};
