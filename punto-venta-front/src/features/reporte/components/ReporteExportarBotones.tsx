import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormatoExportacion } from "../types/ReporteType";

interface Props {
  habilitada: boolean;
  exportandoFormato: FormatoExportacion | null;
  onExportar: (formato: FormatoExportacion) => void;
}

export function ReporteExportarBotones({ habilitada, exportandoFormato, onExportar }: Props) {
  const deshabilitado = !habilitada || exportandoFormato !== null;

  return (
    <div className="flex gap-2">
      <Button variant="outline" disabled={deshabilitado} onClick={() => onExportar("pdf")} className="gap-2">
        {exportandoFormato === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4 text-red-600" />}
        PDF
      </Button>
      <Button variant="outline" disabled={deshabilitado} onClick={() => onExportar("excel")} className="gap-2">
        {exportandoFormato === "excel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 text-emerald-600" />}
        Excel
      </Button>
    </div>
  );
}
