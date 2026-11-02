import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useImprimirTicketHook } from "@/features/impresora/hooks/useImprimirTicketHook";
import { getErrorMessage } from "@/lib/errorHandler";
import { obtenerTicketComprobante } from "../services/ComprobanteService";

export const useImprimirComprobanteHook = () => {
  const { imprimirPdf, imprimiendo } = useImprimirTicketHook();

  const { mutateAsync: generarTicket, isPending: generando } = useMutation({
    mutationFn: obtenerTicketComprobante,
  });

  const imprimirComprobante = async (id: number): Promise<boolean> => {
    try {
      const pdf = await generarTicket(id);
      return await imprimirPdf(pdf);
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al generar el ticket"));
      return false;
    }
  };

  return {
    imprimirComprobante,
    imprimiendo: generando || imprimiendo,
  };
};
