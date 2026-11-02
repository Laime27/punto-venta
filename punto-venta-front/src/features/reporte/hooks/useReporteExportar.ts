import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorHandler";
import { descargarArchivo } from "@/lib/utils";
import { exportarReporte } from "../services/ReporteService";
import type { FiltrosReporteType, FormatoExportacion, ReporteId } from "../types/ReporteType";

interface Exportacion {
  reporte: ReporteId;
  filtros: FiltrosReporteType;
  formato: FormatoExportacion;
}

const EXTENSIONES: Record<FormatoExportacion, string> = { pdf: "pdf", excel: "xlsx" };

export const useReporteExportar = () => {
  const { mutate, isPending, variables } = useMutation({
    mutationFn: ({ reporte, filtros, formato }: Exportacion) => exportarReporte(reporte, filtros, formato),
    onSuccess: (archivo, { reporte, filtros, formato }) =>
      descargarArchivo(archivo, `${reporte}_${filtros.fecha_inicio}_${filtros.fecha_fin}.${EXTENSIONES[formato]}`),
    onError: (error) => toast.error(getErrorMessage(error, "No se pudo exportar el reporte")),
  });

  return {
    exportar: (exportacion: Exportacion) => mutate(exportacion),
    exportandoFormato: isPending ? variables?.formato ?? null : null,
  };
};
