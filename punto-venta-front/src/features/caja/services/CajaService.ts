import axios from "@/lib/axiosConfig";
import type {
  AbrirCajaPayload,
  CajaEstadoActual,
  CerrarCajaPayload,
  FiltrosCaja,
  MovimientoCajaPayload,
} from "../types/CajaType";

const BASE = "/caja";

export const listarCajas = async (page = 1, filtros: FiltrosCaja) => {
  const { data } = await axios.get(BASE, {
    params: {
      page,
      estado: filtros.estado === "todos" ? undefined : filtros.estado,
      fecha_inicio: filtros.fecha_inicio || undefined,
      fecha_fin: filtros.fecha_fin || undefined,
    },
  });
  return data;
};

export const obtenerCajaId = async (id: number) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const obtenerEstadoActualCaja = async (): Promise<CajaEstadoActual> => {
  const { data } = await axios.get(`${BASE}/estado-actual`);
  return data;
};

export const obtenerResumenCaja = async (id: number) => {
  const { data } = await axios.get(`${BASE}/${id}/resumen`);
  return data;
};

export const abrirCaja = async (payload: AbrirCajaPayload) => {
  const { data } = await axios.post(`${BASE}/abrir`, payload);
  return data;
};

export const cerrarCaja = async (id: number, payload: CerrarCajaPayload) => {
  const { data } = await axios.post(`${BASE}/${id}/cerrar`, payload);
  return data;
};

export const registrarMovimientoCaja = async (payload: MovimientoCajaPayload) => {
  const { data } = await axios.post(`${BASE}/movimientos`, payload);
  return data;
};
