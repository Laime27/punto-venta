import axios from "@/lib/axiosConfig";
import type { CotizacionParaVentaType } from "../types/PosType";

export const registrarVenta = async (data: any) => {
  const { data: response } = await axios.post("/comprobante/registrar-venta", data);
  return response;
};

export const obtenerCotizacionParaVenta = async (id: number) => {
  const { data } = await axios.get<CotizacionParaVentaType>(`/cotizacion/${id}/para-venta`);
  return data;
};
