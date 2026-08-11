import axios from "@/lib/axiosConfig"

export const listarUnidades = async () => {
  const { data } = await axios.get("/unidad")
  return data
}
