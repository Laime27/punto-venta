import { useState } from "react";
import { type CotizacionType } from "../../types/CotizacionType";
import { descargarPdfCotizacion } from "../../services/CotizacionService";
import { abrirPdf } from "@/lib/utils";

export function useCotizacionTableActions() {
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<CotizacionType | null>(null);

  const verPdf = async (id: number) => {
    try {
      await abrirPdf(await descargarPdfCotizacion(id), `cotizacion_${id}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return {
    cotizacionSeleccionada,
    setCotizacionSeleccionada,
    verPdf,
  };
}
