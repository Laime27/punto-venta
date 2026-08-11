import axios from "@/lib/axiosConfig";
import type { AuthType } from "../types/AuthType";


export const loginAuth = async (data: AuthType) => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};
