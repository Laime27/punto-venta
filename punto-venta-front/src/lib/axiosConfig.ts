import axiosLib from "axios";
import { getToken } from "@/lib/cookie";

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
