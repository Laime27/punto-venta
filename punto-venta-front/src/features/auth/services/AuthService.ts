import axios from "@/lib/axiosConfig";
import type { AuthType, LoginRespuestaType, SesionType } from "../types/AuthType";

export const SESION_QUERY_KEY = ["auth", "me"];

export const loginAuth = async (data: AuthType): Promise<LoginRespuestaType> => {
  const response = await axios.post<LoginRespuestaType>("/auth/login", data);
  return response.data;
};

export const getAuthMe = async (): Promise<SesionType> => {
  const response = await axios.get<SesionType>("/auth/me");
  return response.data;
};

export const logoutAuth = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};
