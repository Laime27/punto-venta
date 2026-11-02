import axios from "@/lib/axiosConfig";
import type { Impresora, ImpresoraGuardarResponse, ImpresoraPayload } from "../types/ImpresoraType";

const BASE = "/impresora";

const esImpresora = (data: unknown): data is Impresora =>
  typeof data === "object" && data !== null && "id" in data;

export const obtenerImpresora = async () => {
  const { data } = await axios.get<unknown>(BASE);
  return esImpresora(data) ? data : null;
};

export const guardarImpresora = async (payload: ImpresoraPayload) => {
  const { data } = await axios.post<ImpresoraGuardarResponse>(BASE, payload);
  return data;
};

export const obtenerTicketPrueba = async (payload?: ImpresoraPayload) => {
  const { data } = await axios.get<Blob>(`${BASE}/ticket-prueba`, {
    params: payload,
    responseType: "blob",
  });
  return data;
};
