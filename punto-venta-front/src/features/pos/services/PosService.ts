import axios from "@/lib/axiosConfig";

export const listPos = async () => {
  const { data } = await axios.get("/pos");
  return data;
};
