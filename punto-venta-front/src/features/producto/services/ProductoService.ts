import axios from "@/lib/axiosConfig";
import type { FiltrosProductosType, FilaImportacionPayloadType } from "../types/ProductoType";

const BASE = "/producto";
const MULTIPART_CONFIG = { headers: { "Content-Type": "multipart/form-data" } };
const RUTA_PLANTILLA = "/Plantilla_Productos.xlsx";

export const obtenerPlantillaProductos = async () => {
  const { data } = await axios.get<Blob>(RUTA_PLANTILLA, { baseURL: "", responseType: "blob" });
  return data;
};

export const listarProductos = async (pagina = 1, filtros: FiltrosProductosType = {}) => {
  const { data } = await axios.get(BASE, { params: { page: pagina, ...filtros } });
  return data;
};

export const listarSelectProductos = async (search?: string) => {
  const { data } = await axios.get(`${BASE}/listar-select`, { params: { search } });
  return data;
};

export const generarCodigoBarras = async (): Promise<{ codigo_barras: string }> => {
  const { data } = await axios.get(`${BASE}/generar-codigo`);
  return data;
};

export const obtenerProducto = async (id: number) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const crearProducto = async (formData: FormData) => {
  const { data } = await axios.post(BASE, formData, MULTIPART_CONFIG);
  return data;
};

export const actualizarProducto = async (id: number, formData: FormData) => {
  const { data } = await axios.post(`${BASE}/${id}?_method=PUT`, formData, MULTIPART_CONFIG);
  return data;
};

export const eliminarProducto = async (id: number) => {
  await axios.delete(`${BASE}/${id}`);
};

export const importarProductos = async (formData: FormData) => {
  const { data } = await axios.post(`${BASE}/importar`, formData, MULTIPART_CONFIG);
  return data;
};

export const importarFilasProductos = async (filas: FilaImportacionPayloadType[]): Promise<{ mensaje: string }> => {
  const { data } = await axios.post(`${BASE}/importar-filas`, { filas });
  return data;
};
