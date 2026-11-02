import { useState } from "react";
import { type CotizacionType } from "../../types/CotizacionType";
import { descargarPdfCotizacion } from "../../services/CotizacionService";

export function useCotizacionTableActions() {
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<CotizacionType | null>(null);

  const verPdf = async (id: number) => {
    try {
      const blob = await descargarPdfCotizacion(id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
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
