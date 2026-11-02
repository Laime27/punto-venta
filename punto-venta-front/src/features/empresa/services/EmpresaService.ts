import axios from "@/lib/axiosConfig";
import type { Empresa, EmpresaGuardarResponse, ZonaHorariaOpcion } from "../types/EmpresaType";
import type { EmpresaFormValues } from "../validations/EmpresaValidation";

const BASE = "/empresa";

export const obtenerEmpresa = async (): Promise<Empresa> => {
  const { data } = await axios.get(BASE);
  return data;
};

export const listarZonasHorarias = async (): Promise<ZonaHorariaOpcion[]> => {
  const { data } = await axios.get(`${BASE}/zonas-horarias`);
  return data;
};

export const guardarEmpresa = async (valores: EmpresaFormValues): Promise<EmpresaGuardarResponse> => {
  const { data } = await axios.post(BASE, construirFormData(valores));
  return data;
};

function construirFormData(valores: EmpresaFormValues): FormData {
  const fd = new FormData();

  fd.append("nombre", valores.nombre);
  fd.append("ruc", valores.ruc);
  fd.append("telefono", valores.telefono);
  fd.append("email", valores.email);
  fd.append("direccion", valores.direccion);
  fd.append("moneda_simbolo", valores.moneda_simbolo);
  fd.append("timezone", valores.timezone);
  if (valores.logo) fd.append("logo", valores.logo);
  else if (valores.quitar_logo) fd.append("quitar_logo", "1");

  return fd;
}
