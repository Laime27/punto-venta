import axios from "@/lib/axiosConfig";

const BASE = "/proveedor";

export const listarProveedor = async (page: number = 1) => {
  const { data } = await axios.get(BASE, { params: { page } });
  return data;
};

export const crearProveedor = async (data: any) => {
  const res = await axios.post(BASE, data);
  return res.data;
};

export const actualizarProveedor = async (id: number, data: any) => {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
};

export const eliminarProveedor = async (id: number) => {
  const res = await axios.delete(`${BASE}/${id}`);
  return res.data;
};

export const obtenerProveedorId = async (id: number) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

export const listarSelectProveedor = async (search: string = "") => {
  const { data } = await axios.get(`${BASE}/listar-select`, { params: { search } });
  return data;
};
