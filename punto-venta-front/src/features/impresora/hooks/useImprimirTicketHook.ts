import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { imprimirPdfEnAgente } from "../services/AgenteImpresionService";
import { obtenerImpresora } from "../services/ImpresoraService";
import type { AgenteErrorResponse } from "../types/ImpresoraType";
import { IMPRESORA_QUERY_KEY, IMPRESORA_STALE_TIME } from "./useImpresoraHook";

export const MENSAJE_AGENTE_SIN_CONEXION =
  "No se pudo conectar con el servicio de impresión. Verifique que esté en ejecución.";

const obtenerMensajeErrorAgente = (error: unknown): string => {
  if (!isAxiosError<AgenteErrorResponse | string>(error)) return "Error al imprimir el ticket";
  if (!error.response) return MENSAJE_AGENTE_SIN_CONEXION;

  const data = error.response.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const primerError = data.errors ? Object.values(data.errors).flat()[0] : undefined;
    return primerError ?? data.message ?? data.title ?? "El servicio de impresión no pudo imprimir el ticket";
  }
  return "El servicio de impresión no pudo imprimir el ticket";
};

export const useImprimirTicketHook = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: enviarAlAgente, isPending: imprimiendo } = useMutation({
    mutationFn: imprimirPdfEnAgente,
  });

  const obtenerNombreConfigurado = async (): Promise<string | null> => {
    try {
      const impresora = await queryClient.ensureQueryData({
        queryKey: IMPRESORA_QUERY_KEY,
        queryFn: obtenerImpresora,
        staleTime: IMPRESORA_STALE_TIME,
      });
      return impresora?.nombre ?? null;
    } catch {
      return null;
    }
  };

  // nombreImpresora permite imprimir en otra impresora sin guardarla (ej. ticket de prueba)
  const imprimirPdf = async (pdf: Blob, nombreImpresora?: string): Promise<boolean> => {
    const printerName = nombreImpresora ?? (await obtenerNombreConfigurado());

    if (!printerName) {
      toast.error("Configure una impresora", {
        description: "No hay una impresora de tickets configurada.",
        action: { label: "Configurar", onClick: () => navigate("/impresora") },
      });
      return false;
    }

    try {
      await enviarAlAgente({ printerName, file: pdf });
      toast.success(`Ticket enviado a "${printerName}"`);
      return true;
    } catch (error) {
      toast.error(obtenerMensajeErrorAgente(error));
      return false;
    }
  };

  return {
    imprimirPdf,
    imprimiendo,
  };
};
