import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { importarProductos, obtenerPlantillaProductos } from "../services/ProductoService";
import { getErrorMessage } from "@/lib/errorHandler";
import { descargarArchivo } from "@/lib/utils";
import type { ErrorImportacionType, ErrorFilaExcelType, FilaExcelType } from "../types/ProductoType";

const NOMBRE_PLANTILLA = "Plantilla_Productos.xlsx";

export const useProductoImportHook = () => {
  const queryClient = useQueryClient();
  const [modalAbierto, setModalAbierto] = useState(false);

  const [archivo, setArchivo] = useState<File | null>(null);
  const [errorImportacion, setErrorImportacion] = useState<ErrorImportacionType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: importar, isPending: estaImportando } = useMutation({
    mutationFn: () => {
      if (!archivo) throw new Error("No archivo");
      setErrorImportacion(null);
      const formData = new FormData();
      formData.append("archivo_excel", archivo);
      return importarProductos(formData);
    },
    onSuccess: (data) => {
      toast.success(data?.mensaje || "Productos importados correctamente");
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      cerrarModal();
    },
    onError: (error: unknown) => {
      let mensaje = getErrorMessage(error, "Error al importar productos");
      let errores: ErrorFilaExcelType[] = [];
      let filas: FilaExcelType[] = [];

      if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data;
        if (data.mensaje) {
          mensaje = data.mensaje;
        }
        if (Array.isArray(data.errores)) {
          errores = data.errores;
        }
        if (Array.isArray(data.filas)) {
          filas = data.filas;
        }
      }

      setErrorImportacion({
        mensaje,
        errores,
        filas,
      });

      toast.error(mensaje);
    },
  });

  const abrirModal = () => {
    setErrorImportacion(null);
    setModalAbierto(true);
  };
  
  const descargarPlantilla = async () => {
    try {
      await descargarArchivo(await obtenerPlantillaProductos(), NOMBRE_PLANTILLA);
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo descargar la plantilla"));
    }
  };

  const cerrarModal = () => {
    setArchivo(null);
    setErrorImportacion(null);
    if (inputRef.current) inputRef.current.value = "";
    setModalAbierto(false);
  };

  const seleccionarArchivo = (file: File) => {
    setErrorImportacion(null);
    const permitidos = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (permitidos.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      setArchivo(file);
    } else {
      toast.error("Formato de archivo no válido. Solo se admiten Excel o CSV.");
    }
  };

  const manejarArrastrarSobre = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const manejarSoltar = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      seleccionarArchivo(e.dataTransfer.files[0]);
    }
  };

  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      seleccionarArchivo(e.target.files[0]);
    }
  };

  const removerArchivo = () => {
    setArchivo(null);
    setErrorImportacion(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return {
    estado: {
      modalAbierto,
      archivo,
      estaImportando,
      errorImportacion,
    },
    refs: {
      inputRef,
    },
    funciones: {
      abrirModal,
      cerrarModal,
      importar,
      manejarArrastrarSobre,
      manejarSoltar,
      manejarCambioInput,
      removerArchivo,
      descargarPlantilla,
      limpiarError: () => setErrorImportacion(null),
    },
  };
};
