import { Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FiltrosKardexType } from "../types/KardexType";

interface Props {
  filtros: {
    valores: FiltrosKardexType;
    errorFechas: string | null;
    tieneFiltrosActivos: boolean;
    cambiarFiltros: (nuevos: Partial<FiltrosKardexType>) => void;
    limpiarFiltros: () => void;
  };
}

export function KardexFiltros({ filtros }: Props) {
  const { valores, errorFechas, tieneFiltrosActivos, cambiarFiltros, limpiarFiltros } = filtros;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5 w-full sm:w-[170px]">
          <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Desde
          </Label>
          <Input
            type="date"
            value={valores.fecha_inicio}
            onChange={(e) => cambiarFiltros({ fecha_inicio: e.target.value })}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5 w-full sm:w-[170px]">
          <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Hasta
          </Label>
          <Input
            type="date"
            value={valores.fecha_fin}
            onChange={(e) => cambiarFiltros({ fecha_fin: e.target.value })}
            className={`h-10 text-sm ${errorFechas ? "border-destructive" : ""}`}
          />
        </div>
        {tieneFiltrosActivos && (
          <Button type="button" variant="outline" size="sm" onClick={limpiarFiltros} className="h-10 text-sm font-bold gap-1.5">
            <RotateCcw className="h-4 w-4" />
            Ver todo
          </Button>
        )}
      </div>
      {errorFechas && <p className="text-xs text-destructive">{errorFechas}</p>}
    </div>
  );
}
