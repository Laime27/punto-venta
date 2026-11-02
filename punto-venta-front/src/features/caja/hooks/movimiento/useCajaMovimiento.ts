import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { registrarMovimientoCaja } from "../../services/CajaService";
import {
  MovimientoCajaSchema,
  type MovimientoCajaFormData,
} from "../../validations/CajaValidation";

const VALORES_INICIALES: MovimientoCajaFormData = {
  tipo: "ingreso",
  monto: 0,
  motivo: "",
  observaciones: "",
};

export const useCajaMovimiento = () => {
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);

  const form = useForm<MovimientoCajaFormData>({
    resolver: zodResolver(MovimientoCajaSchema),
    defaultValues: VALORES_INICIALES,
  });

  const mutation = useMutation({
    mutationFn: registrarMovimientoCaja,
    onSuccess: (res) => {
      toast.success(res?.message || "Movimiento registrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["caja"] });
      setAbierto(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al registrar el movimiento")),
  });

  const cambiarAbierto = (valor: boolean) => {
    if (mutation.isPending) return;
    if (valor) form.reset(VALORES_INICIALES);
    setAbierto(valor);
  };

  const guardar = form.handleSubmit((values) =>
    mutation.mutate({
      tipo: values.tipo,
      monto: values.monto,
      motivo: values.motivo,
      observaciones: values.observaciones?.trim() || undefined,
    })
  );

  return {
    form,
    estado: { abierto, estaEnviando: mutation.isPending },
    funciones: { cambiarAbierto, guardar },
  };
};
