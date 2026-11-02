import { useState } from "react";
import { useReporteFiltros } from "./useReporteFiltros";
import { useReporteConsulta } from "./useReporteConsulta";
import { useReporteDetalle, OPCIONES_POR_PAGINA } from "./useReporteDetalle";
import { useReporteExportar } from "./useReporteExportar";
import type { FormatoExportacion, ReporteId } from "../types/ReporteType";

export const useReporte = <TResumen, TDetalle>(reporte: ReporteId, usaFechas: boolean) => {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(OPCIONES_POR_PAGINA[0]);

  const filtros = useReporteFiltros(() => setPagina(1));
  const habilitado = !usaFechas || !filtros.errorFechas;

  const { datos, cargando } = useReporteConsulta<TResumen>(reporte, filtros.valores, habilitado);
  const detalle = useReporteDetalle<TDetalle>(reporte, filtros.valores, habilitado, { pagina, porPagina, setPagina, setPorPagina });
  const { exportar, exportandoFormato } = useReporteExportar();

  return {
    filtros,
    datos,
    cargando,
    detalle,
    exportacion: {
      habilitada: habilitado,
      exportandoFormato,
      exportar: (formato: FormatoExportacion) => exportar({ reporte, filtros: filtros.valores, formato }),
    },
  };
};
