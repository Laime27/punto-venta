import axiosLib from "axios";
import type { AgenteImprimirPayload, ImpresorasInstaladasResponse } from "../types/ImpresoraType";

const agente = axiosLib.create({
  baseURL: import.meta.env.VITE_PRINT_AGENT_URL,
  timeout: 5000,
});

export const listarImpresorasInstaladas = async () => {
  const { data } = await agente.get<ImpresorasInstaladasResponse>("/api/list");
  return data;
};

export const imprimirPdfEnAgente = async ({ printerName, file }: AgenteImprimirPayload) => {
  const fd = new FormData();
  fd.append("printerName", printerName);
  fd.append("file", file, "ticket.pdf");

  await agente.post("/api/print-ticket", fd, { timeout: 30000 });
};
