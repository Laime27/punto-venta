import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstadoCotizacion } from "../../services/CotizacionService";
import { toast } from "sonner";
import type { CotizacionType } from "../../types/CotizacionType";

export const useCotizacionCambiarEstado = (cotizacion: CotizacionType | null, onClose: () => void) => {
  const queryClient = useQueryClient();
  const [nuevoEstado, setNuevoEstado] = useState<string>("ACEPTADA");
  const [motivoRechazo, setMotivoRechazo] = useState("");

  useEffect(() => {
    if (cotizacion) {
      setNuevoEstado("ACEPTADA");
      setMotivoRechazo("");
    }
  }, [cotizacion]);

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { estado: string; motivo_rechazo?: string } }) =>
      cambiarEstadoCotizacion(id, payload),
    onSuccess: () => {
      toast.success("Estado de cotización actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["cotizaciones"] });
      onClose();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Ocurrió un error al cambiar el estado";
      toast.error(message);
    },
  });

  const handleGuardarEstado = () => {
    if (!cotizacion) return;
    
    mutation.mutate({
      id: cotizacion.id,
      payload: {
        estado: nuevoEstado,
        motivo_rechazo: nuevoEstado === "RECHAZADA" ? motivoRechazo : undefined,
      },
    });
  };

  return {
    nuevoEstado,
    setNuevoEstado,
    motivoRechazo,
    setMotivoRechazo,
    handleGuardarEstado,
    isPending: mutation.isPending,
  };
};
