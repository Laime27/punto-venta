import { ArrowLeft, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { KardexProductoType } from "../types/KardexType";

interface Props {
  producto: KardexProductoType;
  exportando: boolean;
  onExportar: () => void;
  onVolver: () => void;
}

export function KardexEncabezado({ producto, exportando, onExportar, onVolver }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="ghost" size="icon" onClick={onVolver}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight truncate">Kardex: {producto.nombre}</h1>
          {producto.deleted_at && <Badge variant="destructive">Eliminado</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          {[
            producto.codigo_barras,
            producto.categoria?.nombre,
            producto.unidad ? `Unidad: ${producto.unidad.nombre}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <Button variant="outline" onClick={onExportar} disabled={exportando} className="gap-2">
        {exportando ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
        Exportar Excel
      </Button>
    </div>
  );
}
