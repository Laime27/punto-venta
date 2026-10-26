import axios from "@/lib/axiosConfig";
import type { AuthType } from "../types/AuthType";


export const loginAuth = async (data: AuthType) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};

export const getAuthMe = async () => {
  const response = await axios.get("/auth/me");
  return response.data;
};

export const logoutAuth = async () => {
  const response = await axios.post("/auth/logout");
  return response.data;
};
