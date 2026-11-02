import api from "@/lib/axiosConfig";

import type { CotizacionType, CotizacionPayload } from "../types/CotizacionType";

export const listarCotizaciones = async (page=1) => {
  const { data } = await api.get("/cotizacion", { params: { page } });
  return data;
};

export const obtenerCotizacion = async (id: number) => {
  const { data } = await api.get<CotizacionType>(`/cotizacion/${id}`);
  return data;
};

export const crearCotizacion = async (payload: CotizacionPayload) => {
  const { data } = await api.post<CotizacionType>("/cotizacion", payload);
  return data;
};

export const actualizarCotizacion = async (id: number, payload: CotizacionPayload) => {
  const { data } = await api.put<CotizacionType>(`/cotizacion/${id}`, payload);
  return data;
};

export const eliminarCotizacion = async (id: number) => {
  const { data } = await api.delete(`/cotizacion/${id}`);
  return data;
};

export const cambiarEstadoCotizacion = async (id: number, payload: { estado: string; motivo_rechazo?: string }) => {
  const { data } = await api.patch<CotizacionType>(`/cotizacion/${id}/estado`, payload);
  return data;
};

export const descargarPdfCotizacion = async (id: number) => {
  const { data } = await api.get(`/cotizacion/${id}/pdf`, { responseType: 'blob' });
  return data;
};

