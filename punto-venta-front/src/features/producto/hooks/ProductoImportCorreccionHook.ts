import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { importarFilasProductos } from "../services/ProductoService";
import { getErrorMessage } from "@/lib/errorHandler";
import {
  importacionFilasSchema,
  type FilaImportacionFormValues,
  type ImportacionFilasFormValues,
} from "../validations/ProductoImportValidation";
import {
  CAMPOS_IMPORTACION,
  type CampoImportacionType,
  type ErrorFilaExcelType,
  type FilaExcelType,
  type FilaImportacionPayloadType,
  type ValorCeldaExcelType,
} from "../types/ProductoType";

interface ProductoImportCorreccionHookProps {
  filasExcel: FilaExcelType[];
  erroresIniciales: ErrorFilaExcelType[];
  onImportado: () => void;
}

type ErroresServidorType = Record<string, string>;

const claveError = (fila: number, campo: CampoImportacionType) => `${fila}.${campo}`;

const aTexto = (valor: ValorCeldaExcelType | undefined): string => {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "boolean") return valor ? "1" : "0";
  return String(valor);
};

const aFilaFormulario = (fila: FilaExcelType): FilaImportacionFormValues => {
  const valores = Object.fromEntries(
    CAMPOS_IMPORTACION.map((campo) => [campo, aTexto(fila[campo])])
  ) as Record<CampoImportacionType, string>;
  return { fila: fila.fila, ...valores };
};

const aPayload = (fila: FilaImportacionFormValues): FilaImportacionPayloadType => {
  const valores = Object.fromEntries(
    CAMPOS_IMPORTACION.map((campo) => {
      const valor = fila[campo].trim();
      return [campo, valor === "" ? null : valor];
    })
  ) as Record<CampoImportacionType, string | null>;
  return { fila: fila.fila, ...valores };
};

const esCampoImportacion = (campo: string): campo is CampoImportacionType =>
  (CAMPOS_IMPORTACION as readonly string[]).includes(campo);

const aErroresServidor = (errores: ErrorFilaExcelType[]): ErroresServidorType => {
  const resultado: ErroresServidorType = {};
  errores.forEach((error) => {
    if (esCampoImportacion(error.campo)) {
      resultado[claveError(error.fila, error.campo)] = error.errores[0];
    }
  });
  return resultado;
};

export const useProductoImportCorreccionHook = ({
  filasExcel,
  erroresIniciales,
  onImportado,
}: ProductoImportCorreccionHookProps) => {
  const queryClient = useQueryClient();
  const [soloConErrores, setSoloConErrores] = useState(true);
  const [erroresServidor, setErroresServidor] = useState<ErroresServidorType>(() => aErroresServidor(erroresIniciales));
  const [filasMarcadas, setFilasMarcadas] = useState<Set<number>>(() => new Set(erroresIniciales.map((e) => e.fila)));

  const form = useForm<ImportacionFilasFormValues>({
    resolver: zodResolver(importacionFilasSchema),
    defaultValues: { filas: filasExcel.map(aFilaFormulario) },
    mode: "onChange",
  });

  const { fields, remove } = useFieldArray({ control: form.control, name: "filas" });
  const erroresFormulario = form.formState.errors.filas;

  const limpiarErrorServidor = (fila: number, campo: CampoImportacionType) => {
    const clave = claveError(fila, campo);
    setErroresServidor((prev) => {
      if (!(clave in prev)) return prev;
      const resto = { ...prev };
      delete resto[clave];
      return resto;
    });
  };

  const registrarCelda = (indice: number, fila: number, campo: CampoImportacionType) =>
    form.register(`filas.${indice}.${campo}`, {
      onChange: () => limpiarErrorServidor(fila, campo),
    });

  const obtenerError = (indice: number, fila: number, campo: CampoImportacionType): string | undefined =>
    erroresFormulario?.[indice]?.[campo]?.message ?? erroresServidor[claveError(fila, campo)];

  const filaTieneError = (indice: number, fila: number) =>
    CAMPOS_IMPORTACION.some((campo) => Boolean(obtenerError(indice, fila, campo)));

  const marcarFilas = (filas: number[]) => {
    setFilasMarcadas((prev) => new Set([...prev, ...filas]));
  };

  const { mutate: importar, isPending: estaImportando } = useMutation({
    mutationFn: (valores: ImportacionFilasFormValues) => importarFilasProductos(valores.filas.map(aPayload)),
    onSuccess: (data) => {
      toast.success(data?.mensaje || "Productos importados correctamente");
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      onImportado();
    },
    onError: (error: unknown) => {
      let mensaje = getErrorMessage(error, "Error al importar productos");

      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data;
        if (data.mensaje) {
          mensaje = data.mensaje;
        }
        if (Array.isArray(data.errores)) {
          const errores: ErrorFilaExcelType[] = data.errores;
          setErroresServidor(aErroresServidor(errores));
          marcarFilas(errores.map((e) => e.fila));
          setSoloConErrores(true);
        }
      }

      toast.error(mensaje);
    },
  });

  const enviar = form.handleSubmit(
    (valores) => importar(valores),
    (errores) => {
      marcarFilas(
        form.getValues("filas")
          .filter((_, indice) => Boolean(errores.filas?.[indice]))
          .map((fila) => fila.fila)
      );
      setSoloConErrores(true);
      toast.error("Corrige las celdas marcadas en rojo antes de importar.");
    }
  );

  const filasConError = fields.filter((campo, indice) => filaTieneError(indice, campo.fila));

  const filasVisibles = fields
    .map((campo, indice) => ({ campo, indice, tieneError: filaTieneError(indice, campo.fila) }))
    .filter(({ campo, tieneError }) => !soloConErrores || tieneError || filasMarcadas.has(campo.fila));

  return {
    estado: {
      filasVisibles,
      totalFilas: fields.length,
      totalFilasConError: filasConError.length,
      soloConErrores,
      estaImportando,
    },
    funciones: {
      enviar,
      registrarCelda,
      obtenerError,
      eliminarFila: remove,
      setSoloConErrores,
    },
  };
};
