import { Calendar, RotateCcw, Search, Tag } from "lucide-react";
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
import type { FiltrosAjusteInventario, TipoAjusteType } from "../../types/AjusteInventarioType";

interface Props {
  filtros: {
    valores: FiltrosAjusteInventario;
    tipos: TipoAjusteType[];
    tieneFiltrosActivos: boolean;
    cambiarFiltros: (nuevos: Partial<FiltrosAjusteInventario>) => void;
    limpiarFiltros: () => void;
  };
}

export function AjusteInventarioFilters({ filtros }: Props) {
  const { valores, tipos, tieneFiltrosActivos, cambiarFiltros, limpiarFiltros } = filtros;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5 w-full sm:w-[260px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Search className="h-4 w-4" />
          Buscar
        </Label>
        <Input
          value={valores.search}
          onChange={(e) => cambiarFiltros({ search: e.target.value })}
          placeholder="N° de ajuste, motivo o producto..."
          className="h-10 text-sm font-medium text-foreground"
        />
      </div>

      <div className="space-y-1.5 w-full sm:w-[200px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Tag className="h-4 w-4" />
          Tipo
        </Label>
        <Select
          value={valores.tipo_movimiento_id}
          onValueChange={(val) => cambiarFiltros({ tipo_movimiento_id: val as FiltrosAjusteInventario["tipo_movimiento_id"] })}
        >
          <SelectTrigger className="h-10 text-sm font-medium text-foreground">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos" className="text-sm font-medium">Todos los tipos</SelectItem>
            {tipos.map((tipo) => (
              <SelectItem key={tipo.id} value={String(tipo.id)} className="text-sm font-medium">
                {tipo.nombre}
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
