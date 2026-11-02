import { Calendar, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FiltrosCaja } from "../../types/CajaType";

interface Props {
  filtros: {
    valores: FiltrosCaja;
    estados: { id: string; nombre: string }[];
    tieneFiltrosActivos: boolean;
    cambiarFiltros: (nuevos: Partial<FiltrosCaja>) => void;
    limpiarFiltros: () => void;
  };
}

export function CajaFilters({ filtros }: Props) {
  const { valores, estados, tieneFiltrosActivos, cambiarFiltros, limpiarFiltros } = filtros;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5 w-full sm:w-[180px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          Estado
        </Label>
        <Select
          value={valores.estado}
          onValueChange={(val) => cambiarFiltros({ estado: val as FiltrosCaja["estado"] })}
        >
          <SelectTrigger className="h-10 text-sm font-medium text-foreground">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((item) => (
              <SelectItem key={item.id} value={item.id} className="text-sm font-medium">
                {item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 w-full sm:w-[160px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Desde
        </Label>
        <Input
          type="date"
          value={valores.fecha_inicio}
          onChange={(e) => cambiarFiltros({ fecha_inicio: e.target.value })}
          className="h-10 text-sm font-medium text-foreground"
        />
      </div>

      <div className="space-y-1.5 w-full sm:w-[160px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Hasta
        </Label>
        <Input
          type="date"
          value={valores.fecha_fin}
          onChange={(e) => cambiarFiltros({ fecha_fin: e.target.value })}
          className="h-10 text-sm font-medium text-foreground"
        />
      </div>

      {tieneFiltrosActivos && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={limpiarFiltros}
          className="h-10 text-sm font-bold gap-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
