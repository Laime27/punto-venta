import axios from "@/lib/axiosConfig";

export const registrarVenta = async (data: any) => {
  const { data: response } = await axios.post("/comprobante/registrar-venta", data);
  return response;
};
