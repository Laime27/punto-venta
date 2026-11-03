import axios from "@/lib/axiosConfig";
import type { DashboardType } from "../types/DashboardType";

export const obtenerDashboard = async (): Promise<DashboardType> => {
  const { data } = await axios.get<DashboardType>("/dashboard");
  return data;
};
