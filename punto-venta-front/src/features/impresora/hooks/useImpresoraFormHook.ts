import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { guardarImpresora, obtenerTicketPrueba } from "../services/ImpresoraService";
import { impresoraSchema, type ImpresoraFormValues } from "../validations/ImpresoraValidation";
import type { Impresora, ImpresoraOpcion, ImpresoraValidacionError } from "../types/ImpresoraType";
import { IMPRESORA_QUERY_KEY, useImpresoraHook } from "./useImpresoraHook";
import { useImpresorasInstaladasHook } from "./useImpresorasInstaladasHook";
import { useImprimirTicketHook } from "./useImprimirTicketHook";
import { getErrorMessage } from "@/lib/errorHandler";

const ANCHO_DEFAULT = 80;

const aValoresFormulario = (impresora: Impresora | null): ImpresoraFormValues => ({
  nombre: impresora?.nombre ?? "",
  ancho: impresora?.ancho ?? ANCHO_DEFAULT,
});

const CAMPOS_FORMULARIO = Object.keys(impresoraSchema.shape);

const esCampoFormulario = (campo: string): campo is keyof ImpresoraFormValues =>
  CAMPOS_FORMULARIO.includes(campo);

export const useImpresoraFormHook = () => {
  const queryClient = useQueryClient();
  const { impresora, isLoading } = useImpresoraHook({ siempreActualizar: true });
  const { impresorasInstaladas, agenteConectado, verificandoAgente, refrescar } = useImpresorasInstaladasHook();
  const { imprimirPdf, imprimiendo } = useImprimirTicketHook();

  const form = useForm<ImpresoraFormValues>({
    resolver: zodResolver(impresoraSchema),
    defaultValues: aValoresFormulario(null),
  });

  const nombreSeleccionado = useWatch({ control: form.control, name: "nombre" });

  useEffect(() => {
    if (!isLoading) form.reset(aValoresFormulario(impresora));
  }, [impresora, isLoading, form]);

  const { mutate: guardar, isPending: guardando } = useMutation({
    mutationFn: guardarImpresora,
    onSuccess: (respuesta) => {
      toast.success(respuesta.message || "Impresora configurada correctamente");
      queryClient.setQueryData(IMPRESORA_QUERY_KEY, respuesta.data);
      form.reset(aValoresFormulario(respuesta.data));
    },
    onError: (error) => {
      const errores = isAxiosError<ImpresoraValidacionError>(error) && error.response?.status === 422
        ? error.response.data.errors
        : undefined;

      if (errores) {
        Object.entries(errores).forEach(([campo, mensajes]) => {
          if (esCampoFormulario(campo)) form.setError(campo, { message: mensajes[0] });
        });
      }

      toast.error(getErrorMessage(error, "Error al guardar la impresora"));
    },
  });

  const { mutateAsync: generarTicketPrueba, isPending: generandoPrueba } = useMutation({
    mutationFn: obtenerTicketPrueba,
  });

  const onSubmit = form.handleSubmit((valores) => guardar(valores));

  // Usa los valores actuales del formulario, aunque todavía no estén guardados
  const imprimirPrueba = form.handleSubmit(async (valores) => {
    try {
      const pdf = await generarTicketPrueba(valores);
      await imprimirPdf(pdf, valores.nombre);
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al generar el ticket de prueba"));
    }
  });

  const cancelar = () => {
    form.reset(aValoresFormulario(impresora));
  };

  const seleccionarAncho = (ancho: number) => {
    form.setValue("ancho", ancho, { shouldDirty: true, shouldValidate: true });
  };

  const nombresExtra = [impresora?.nombre, nombreSeleccionado].filter(
    (nombre): nombre is string => Boolean(nombre) && !impresorasInstaladas.includes(nombre ?? "")
  );

  const opciones: ImpresoraOpcion[] = [
    ...[...new Set(nombresExtra)].map((nombre) => ({ nombre, noEncontrada: agenteConectado })),
    ...impresorasInstaladas.map((nombre) => ({ nombre, noEncontrada: false })),
  ];

  return {
    form,
    onSubmit,
    cargando: isLoading,
    guardando,
    hayCambios: form.formState.isDirty,
    cancelar,
    seleccionarAncho,
    impresoras: {
      opciones,
      refrescar,
    },
    agente: {
      conectado: agenteConectado,
      verificando: verificandoAgente,
    },
    prueba: {
      imprimir: imprimirPrueba,
      imprimiendo: generandoPrueba || imprimiendo,
      puedeImprimir: agenteConectado && Boolean(nombreSeleccionado) && !generandoPrueba && !imprimiendo,
    },
  };
};
