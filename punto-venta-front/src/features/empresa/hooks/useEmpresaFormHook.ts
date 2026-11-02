import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { guardarEmpresa } from "../services/EmpresaService";
import { empresaSchema, type EmpresaFormValues } from "../validations/EmpresaValidation";
import type { Empresa, EmpresaValidacionError } from "../types/EmpresaType";
import { EMPRESA_QUERY_KEY, useEmpresaHook } from "./useEmpresaHook";
import { useZonasHorariasHook } from "./useZonasHorariasHook";
import { getErrorMessage } from "@/lib/errorHandler";

const ZONA_HORARIA_DEFAULT = "America/Lima";

const VALORES_VACIOS: EmpresaFormValues = {
  nombre: "",
  ruc: "",
  telefono: "",
  email: "",
  direccion: "",
  moneda_simbolo: "",
  timezone: ZONA_HORARIA_DEFAULT,
  logo: null,
  quitar_logo: false,
};

const CAMPOS_FORMULARIO = Object.keys(empresaSchema.shape);

const aValoresFormulario = (empresa: Empresa): EmpresaFormValues => ({
  nombre: empresa.nombre,
  ruc: empresa.ruc ?? "",
  telefono: empresa.telefono ?? "",
  email: empresa.email ?? "",
  direccion: empresa.direccion ?? "",
  moneda_simbolo: empresa.moneda_simbolo,
  timezone: empresa.timezone || ZONA_HORARIA_DEFAULT,
  logo: null,
  quitar_logo: false,
});

const esCampoFormulario = (campo: string): campo is keyof EmpresaFormValues =>
  CAMPOS_FORMULARIO.includes(campo);

export const useEmpresaFormHook = () => {
  const queryClient = useQueryClient();
  const { empresa, isLoading } = useEmpresaHook();
  const { zonasHorarias, cargandoZonas } = useZonasHorariasHook();
  const [urlLogoLocal, setUrlLogoLocal] = useState<string | null>(null);

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: VALORES_VACIOS,
  });

  const logo = useWatch({ control: form.control, name: "logo" });
  const quitarLogo = useWatch({ control: form.control, name: "quitar_logo" });

  useEffect(() => {
    if (empresa) form.reset(aValoresFormulario(empresa));
  }, [empresa, form]);

  useEffect(() => {
    if (!urlLogoLocal) return;
    return () => URL.revokeObjectURL(urlLogoLocal);
  }, [urlLogoLocal]);

  const restablecer = (datos: Empresa) => {
    form.reset(aValoresFormulario(datos));
    setUrlLogoLocal(null);
  };

  const { mutate: guardar, isPending: guardando } = useMutation({
    mutationFn: guardarEmpresa,
    onSuccess: (respuesta) => {
      toast.success(respuesta.message || "Empresa actualizada correctamente");
      queryClient.setQueryData(EMPRESA_QUERY_KEY, respuesta.data);
      restablecer(respuesta.data);
    },
    onError: (error) => {
      const errores = isAxiosError<EmpresaValidacionError>(error) && error.response?.status === 422
        ? error.response.data.errors
        : undefined;

      if (errores) {
        Object.entries(errores).forEach(([campo, mensajes]) => {
          if (esCampoFormulario(campo)) form.setError(campo, { message: mensajes[0] });
        });
      }

      toast.error(getErrorMessage(error, "Error al guardar los datos de la empresa"));
    },
  });

  const onSubmit = form.handleSubmit((valores) => guardar(valores));

  const cancelar = () => {
    if (empresa) restablecer(empresa);
  };

  const cambiarLogo = (archivo: File) => {
    form.setValue("logo", archivo, { shouldDirty: true, shouldValidate: true });
    form.setValue("quitar_logo", false, { shouldDirty: true });
    setUrlLogoLocal(URL.createObjectURL(archivo));
  };

  const eliminarLogo = () => {
    form.setValue("logo", null, { shouldDirty: true, shouldValidate: true });
    form.setValue("quitar_logo", Boolean(empresa?.logo), { shouldDirty: true });
    setUrlLogoLocal(null);
  };

  const vistaPreviaLogo = logo ? urlLogoLocal : quitarLogo ? null : empresa?.logo ?? null;

  return {
    form,
    onSubmit,
    cargando: isLoading,
    guardando,
    hayCambios: form.formState.isDirty,
    cancelar,
    zonasHorarias,
    cargandoZonas,
    logo: {
      vistaPrevia: vistaPreviaLogo,
      error: form.formState.errors.logo?.message,
      cambiar: cambiarLogo,
      eliminar: eliminarLogo,
    },
  };
};
