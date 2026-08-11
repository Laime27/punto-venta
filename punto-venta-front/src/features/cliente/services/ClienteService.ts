import axios from "@/lib/axiosConfig";

const BASE = "/cliente";

export const listarCliente = async (page: number = 1) => {
  const { data } = await axios.get(BASE, { params: { page } });
  return data;
};

export const crearCliente = async (data: any) => {
  const res = await axios.post(BASE, data);
  return res.data;
};

export const actualizarCliente = async (id: number, data: any) => {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
};

export const eliminarCliente = async (id: number) => {
  const res = await axios.delete(`${BASE}/${id}`);
  return res.data;
};

export const obtenerClienteId = async (id: number) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

export const listarSelectCliente = async (search: string = "") => {
  const { data } = await axios.get(`${BASE}/listar-select`, { params: { search } });
  return data;
};
