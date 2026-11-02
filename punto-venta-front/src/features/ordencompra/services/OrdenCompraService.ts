import axios from "@/lib/axiosConfig";
import { type OrdenCompraCreatePayload, type OrdenCompraRecibirPayload } from "../types/OrdenCompraType";

const BASE = "/orden-compra";

export const listarOrdenesCompra = async (page = 1) => {
  const { data } = await axios.get(BASE, { params: { page } });
  return data;
};

export const obtenerOrdenCompraId = async (id: number) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const crearOrdenCompra = async (payload: OrdenCompraCreatePayload) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

export const recibirOrdenCompra = async (id: number, payload: OrdenCompraRecibirPayload) => {
  const { data } = await axios.post(`${BASE}/${id}/recibir`, payload);
  return data;
};

export const actualizarOrdenCompra = async (id: number, payload: OrdenCompraCreatePayload) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};
