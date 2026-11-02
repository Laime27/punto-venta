import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { abrirCaja } from "../../services/CajaService";
import { AbrirCajaSchema, type AbrirCajaFormData } from "../../validations/CajaValidation";

const VALORES_INICIALES: AbrirCajaFormData = { monto_apertura: 0, observaciones: "" };

export const useCajaAbrir = () => {
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);

  const form = useForm<AbrirCajaFormData>({
    resolver: zodResolver(AbrirCajaSchema),
    defaultValues: VALORES_INICIALES,
  });

  const mutation = useMutation({
    mutationFn: abrirCaja,
    onSuccess: (res) => {
      toast.success(res?.message || "Caja aperturada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["caja"] });
      setAbierto(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Error al abrir la caja")),
  });

  const cambiarAbierto = (valor: boolean) => {
    if (mutation.isPending) return;
    if (valor) form.reset(VALORES_INICIALES);
    setAbierto(valor);
  };

  const guardar = form.handleSubmit((values) =>
    mutation.mutate({
      monto_apertura: values.monto_apertura,
      observaciones: values.observaciones?.trim() || undefined,
    })
  );

  return {
    form,
    estado: { abierto, estaEnviando: mutation.isPending },
    funciones: { cambiarAbierto, guardar },
  };
};
