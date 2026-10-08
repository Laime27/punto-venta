import axios from "@/lib/axiosConfig";

export const listarCategoria = async (page = 1, search?: string) => {
  const { data } = await axios.get("/categoria", { params: { page, search } });
  return data;
};

export const crearCategoria = async (nombre: string) => {
  const { data } = await axios.post("/categoria", { nombre });
  return data;
};

export const obtenerCategoriaId = async (id: number) => {
  const { data } = await axios.get(`/categoria/${id}`);
  return data;
};

export const actualizarCategoria = async (id: number, nombre: string) => {
  const { data } = await axios.put(`/categoria/${id}`, { nombre });
  return data;
};

export const eliminarCategoria = async (id: number) => {
  await axios.delete(`/categoria/${id}`);
};

export const listarSelectCategoria = async (search: string = "") => {
  const { data } = await axios.get("/categoria/listar-select", { params: { search } });
  return data;
};
