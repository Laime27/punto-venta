import axios from "@/lib/axiosConfig";
import type { FiltrosProductosType } from "../types/ProductoType";

const BASE = "/producto";

export const listarProductos = async (pagina = 1, filtros: FiltrosProductosType = {}) => {
  const { data } = await axios.get(BASE, { params: { page: pagina, ...filtros } });
  return data;
};

export const listarSelectProductos = async (search?: string) => {
  const { data } = await axios.get(`${BASE}/listar-select`, { params: { search } });
  return data;
};

export const obtenerProducto = async (id: number) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const crearProducto = async (formData: FormData) => {
  const { data } = await axios.post(BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const actualizarProducto = async (id: number, formData: FormData) => {
  const { data } = await axios.post(`${BASE}/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const eliminarProducto = async (id: number) => {
  await axios.delete(`${BASE}/${id}`);
};
