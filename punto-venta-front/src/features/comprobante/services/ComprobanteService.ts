import axios from "@/lib/axiosConfig";
import type {
  FiltrosComprobanteType,
  ComprobanteType,
  AnularComprobantePayload,
  AbonarCreditoPayload,
  ComprobanteListadoResponse,
} from "../types/ComprobanteType";

const BASE = "/comprobante";

export const listarComprobantes = async (
  pagina = 1,
  filtros: FiltrosComprobanteType = {}
): Promise<ComprobanteListadoResponse> => {
  const { data } = await axios.get(BASE, {
    params: {
      page: pagina,
      ...filtros,
      estado: filtros.estado === "todos" ? undefined : filtros.estado,
      forma_pago: filtros.forma_pago === "todos" ? undefined : filtros.forma_pago,
    },
  });
  return data;
};

export const obtenerComprobante = async (id: number): Promise<ComprobanteType> => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const anularComprobante = async (
  id: number,
  payload: AnularComprobantePayload
) => {
  const { data } = await axios.post(`${BASE}/${id}/anular`, payload);
  return data;
};

export const abonarCredito = async (
  creditoId: number,
  payload: AbonarCreditoPayload
) => {
  const { data } = await axios.post(`${BASE}/credito/${creditoId}/abonar`, payload);
  return data;
};

export const obtenerTicketComprobante = async (id: number): Promise<Blob> => {
  const { data } = await axios.get<Blob>(`${BASE}/${id}/ticket`, { responseType: "blob" });
  return data;
};
