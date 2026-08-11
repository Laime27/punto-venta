import axios from "@/lib/axiosConfig";

const BASE = "/metodo-pago";

export const listarMetodoPago = async (page = 1) => {
  const { data } = await axios.get(BASE, { params: { page } });
  return data;
};

export const listarMetodoPagoTodos = async () => {
  const { data } = await axios.get(`${BASE}/listar-todos`);
  return data;
};


export const crearMetodoPago = async (payload: { nombre: string; tipo: string }) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

export const obtenerMetodoPagoId = async (id: number) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};
 
export const actualizarMetodoPago = async (id: number, payload: { nombre: string; tipo: string }) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};

export const eliminarMetodoPago = async (id: number) => {
  await axios.delete(`/metodo-pago/${id}`);
};

