import axios from "@/lib/axiosConfig";

export const listDashboard = async () => {
  const { data } = await axios.get("/dashboard");
  return data;
};
