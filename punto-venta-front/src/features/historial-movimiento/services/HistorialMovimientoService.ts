import axios from "@/lib/axiosConfig";
import type {
  FiltrosHistorialType,
  HistorialRespuestaType,
  TipoMovimientoType,
} from "../types/HistorialMovimientoType";

const BASE = "/historial-movimiento";

export const listarHistorial = async (pagina: number, filtros: FiltrosHistorialType): Promise<HistorialRespuestaType> => {
  const { data } = await axios.get(BASE, {
    params: {
      page: pagina,
      per_page: filtros.per_page,
      search: filtros.search || undefined,
      tipo_movimiento_id: filtros.tipo_movimiento_id === "todos" ? undefined : filtros.tipo_movimiento_id,
      operacion: filtros.operacion === "todos" ? undefined : filtros.operacion,
      fecha_inicio: filtros.fecha_inicio || undefined,
      fecha_fin: filtros.fecha_fin || undefined,
    },
  });
  return data;
};

export const listarTiposMovimiento = async (): Promise<TipoMovimientoType[]> => {
  const { data } = await axios.get(`${BASE}/tipos`);
  return data;
};
