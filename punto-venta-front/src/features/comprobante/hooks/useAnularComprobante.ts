import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { anularComprobante } from "../services/ComprobanteService";
import type { ComprobanteType } from "../types/ComprobanteType";

interface UseAnularComprobanteProps {
  comprobante: ComprobanteType | null;
  alCerrar: () => void;
  alExito?: () => void;
}

export function useAnularComprobante({
  comprobante,
  alCerrar,
  alExito,
}: UseAnularComprobanteProps) {
  const [motivo, setMotivo] = useState("");
  const [estaEnviando, setEstaEnviando] = useState(false);
  const queryClient = useQueryClient();

  const pagos = comprobante?.pagos ?? [];
  const totalPagado = pagos.reduce((total, pago) => total + Number(pago.monto), 0);
  const montoADevolver = Math.min(totalPagado, Number(comprobante?.total ?? 0));
  const metodosDevolucion = [...new Set(pagos.map((pago) => pago.metodo_pago?.nombre).filter(Boolean))].join(", ");

  const cerrarModal = () => {
    if (estaEnviando) return;
    setMotivo("");
    alCerrar();
  };

  const confirmarAnulacion = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!comprobante) return;

    if (!motivo.trim()) {
      toast.error("Debe ingresar el motivo de anulación.");
      return;
    }

    try {
      setEstaEnviando(true);
      const res = await anularComprobante(comprobante.id, {
        motivo_anulacion: motivo.trim(),
      });

      toast.success(res?.message || "Comprobante anulado exitosamente");

      queryClient.invalidateQueries({ queryKey: ["comprobantes"] });
      queryClient.invalidateQueries({ queryKey: ["caja"] });

      setMotivo("");
      alCerrar();
      alExito?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Ocurrió un error al anular el comprobante."
      );
    } finally {
      setEstaEnviando(false);
    }
  };

  return {
    motivo,
    setMotivo,
    estaEnviando,
    montoADevolver,
    metodosDevolucion,
    cerrarModal,
    confirmarAnulacion,
  };
}
