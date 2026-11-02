import axios from "@/lib/axiosConfig";
import type { FiltrosReporteType, FormatoExportacion, OpcionSelect, PaginadoType, ReporteId } from "../types/ReporteType";

const BASE = "/reporte";

const parametros = (filtros: FiltrosReporteType) => ({
  fecha_inicio: filtros.fecha_inicio,
  fecha_fin: filtros.fecha_fin,
  user_id: filtros.user_id ?? undefined,
  categoria_id: filtros.categoria_id ?? undefined,
  producto_id: filtros.producto_id ?? undefined,
  cliente_id: filtros.cliente_id ?? undefined,
  solo_stock_bajo: filtros.solo_stock_bajo ? 1 : undefined,
});

export const obtenerReporte = async <T>(reporte: ReporteId, filtros: FiltrosReporteType): Promise<T> => {
  const { data } = await axios.get<T>(`${BASE}/${reporte}`, { params: parametros(filtros) });
  return data;
};

export const obtenerDetalleReporte = async <T>(
  reporte: ReporteId,
  filtros: FiltrosReporteType,
  pagina: number,
  porPagina: number
): Promise<PaginadoType<T>> => {
  const { data } = await axios.get<PaginadoType<T>>(`${BASE}/${reporte}/detalle`, {
    params: { ...parametros(filtros), page: pagina, per_page: porPagina },
  });
  return data;
};

export const exportarReporte = async (reporte: ReporteId, filtros: FiltrosReporteType, formato: FormatoExportacion): Promise<Blob> => {
  const { data } = await axios.get<Blob>(`${BASE}/${reporte}/exportar`, {
    params: { ...parametros(filtros), formato },
    responseType: "blob",
  });
  return data;
};

export const listarVendedores = async (search: string = ""): Promise<OpcionSelect[]> => {
  const { data } = await axios.get<OpcionSelect[]>(`${BASE}/vendedores`, { params: { search } });
  return data;
};
