import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReporteExportarBotones } from "./ReporteExportarBotones";
import type { FormatoExportacion } from "../types/ReporteType";

interface Props {
  titulo: string;
  descripcion: string;
  exportacion: {
    habilitada: boolean;
    exportandoFormato: FormatoExportacion | null;
    exportar: (formato: FormatoExportacion) => void;
  };
  children: ReactNode;
}

export function ReporteEncabezado({ titulo, descripcion, exportacion, children }: Props) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
            <p className="text-sm text-muted-foreground">{descripcion}</p>
          </div>
          <ReporteExportarBotones
            habilitada={exportacion.habilitada}
            exportandoFormato={exportacion.exportandoFormato}
            onExportar={exportacion.exportar}
          />
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
