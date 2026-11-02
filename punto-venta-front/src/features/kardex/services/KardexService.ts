import axios from "@/lib/axiosConfig";
import type { FiltrosKardexType, KardexRespuestaType } from "../types/KardexType";

const parametros = (filtros: FiltrosKardexType) => ({
  fecha_inicio: filtros.fecha_inicio || undefined,
  fecha_fin: filtros.fecha_fin || undefined,
});

export const obtenerKardex = async (productoId: number, pagina: number, filtros: FiltrosKardexType): Promise<KardexRespuestaType> => {
  const { data } = await axios.get(`/producto/${productoId}/kardex`, {
    params: { page: pagina, ...parametros(filtros) },
  });
  return data;
};

export const exportarKardex = async (productoId: number, filtros: FiltrosKardexType): Promise<Blob> => {
  const { data } = await axios.get<Blob>(`/producto/${productoId}/kardex/exportar`, {
    params: parametros(filtros),
    responseType: "blob",
  });
  return data;
};
