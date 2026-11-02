import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { cerrarCaja, obtenerResumenCaja } from "../../services/CajaService";
import { CerrarCajaSchema, type CerrarCajaFormData } from "../../validations/CajaValidation";
import type { CajaCierreResultado, CajaResumen } from "../../types/CajaType";

const VALORES_INICIALES: CerrarCajaFormData = { monto_real: 0, observaciones: "" };

export const useCajaCerrar = (cajaId: number) => {
  const queryClient = useQueryClient();
  const [abierto, setAbierto] = useState(false);
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [resultado, setResultado] = useState<CajaCierreResultado | null>(null);

  const { data, isLoading: cargandoResumen } = useQuery({
    queryKey: ["caja", "resumen", cajaId],
    queryFn: () => obtenerResumenCaja(cajaId),
    enabled: abierto,
  });
  const resumen: CajaResumen | undefined = data;

  const form = useForm<CerrarCajaFormData>({
    resolver: zodResolver(CerrarCajaSchema),
    defaultValues: VALORES_INICIALES,
  });

  const montoIngresado = useWatch({ control: form.control, name: "monto_real" });
  const montoReal = Number.isFinite(montoIngresado) ? montoIngresado : 0;
  const diferencia = Number((montoReal - (resumen?.saldo_teorico ?? 0)).toFixed(2));

  const mutation = useMutation({
    mutationFn: (values: CerrarCajaFormData) =>
      cerrarCaja(cajaId, {
        monto_real: values.monto_real,
        observaciones: values.observaciones?.trim() || undefined,
      }),
    onSuccess: (res) => {
      toast.success(res?.message || "Caja cerrada exitosamente");
      setResultado(res?.data ?? null);
      setConfirmacionAbierta(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al cerrar la caja"));
      setConfirmacionAbierta(false);
    },
  });

  const cambiarAbierto = (valor: boolean) => {
    if (mutation.isPending) return;
    if (valor) {
      form.reset(VALORES_INICIALES);
      setResultado(null);
    } else if (resultado) {
      // Se refresca al cerrar el modal para no desmontar la vista del resultado.
      queryClient.invalidateQueries({ queryKey: ["caja"] });
    }
    setAbierto(valor);
  };

  const cambiarConfirmacion = (valor: boolean) => {
    if (mutation.isPending) return;
    setConfirmacionAbierta(valor);
  };

  const solicitarConfirmacion = form.handleSubmit(() => setConfirmacionAbierta(true));

  const confirmarCierre = () => mutation.mutate(form.getValues());

  return {
    form,
    estado: {
      abierto,
      confirmacionAbierta,
      resumen,
      cargandoResumen,
      resultado,
      diferencia,
      estaEnviando: mutation.isPending,
    },
    funciones: {
      cambiarAbierto,
      cambiarConfirmacion,
      solicitarConfirmacion,
      confirmarCierre,
    },
  };
};
