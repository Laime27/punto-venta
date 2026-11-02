import { ArrowUpDown, Calendar, RotateCcw, Search, Tag } from "lucide-react";
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
import type { FiltroOperacion, FiltrosHistorialType, TipoMovimientoType } from "../types/HistorialMovimientoType";

interface Props {
  filtros: {
    valores: FiltrosHistorialType;
    tipos: TipoMovimientoType[];
    errorFechas: string | null;
    tieneFiltrosActivos: boolean;
    cambiarFiltros: (nuevos: Partial<FiltrosHistorialType>) => void;
    limpiarFiltros: () => void;
  };
}

export function HistorialMovimientoFilters({ filtros }: Props) {
  const { valores, tipos, errorFechas, tieneFiltrosActivos, cambiarFiltros, limpiarFiltros } = filtros;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5 w-full sm:w-[240px]">
          <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Search className="h-4 w-4" />
            Producto
          </Label>
          <Input
            value={valores.search}
            onChange={(e) => cambiarFiltros({ search: e.target.value })}
            placeholder="Nombre o código..."
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1.5 w-full sm:w-[220px]">
          <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            Tipo de movimiento
          </Label>
          <Select value={valores.tipo_movimiento_id} onValueChange={(val) => cambiarFiltros({ tipo_movimiento_id: val })}>
            <SelectTrigger className="h-10 text-sm w-full">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              {tipos.map((tipo) => (
                <SelectItem key={tipo.id} value={String(tipo.id)}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 w-full sm:w-[150px]">
          <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <ArrowUpDown className="h-4 w-4" />
            Operación
          </Label>
          <Select value={valores.operacion} onValueChange={(val) => cambiarFiltros({ operacion: val as FiltroOperacion })}>
            <SelectTrigger className="h-10 text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="+">Entradas (+)</SelectItem>
              <SelectItem value="-">Salidas (−)</SelectItem>
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
            className="h-10 text-sm"
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
            className={`h-10 text-sm ${errorFechas ? "border-destructive" : ""}`}
          />
        </div>

        {tieneFiltrosActivos && (
          <Button type="button" variant="outline" size="sm" onClick={limpiarFiltros} className="h-10 text-sm font-bold gap-1.5">
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>
      {errorFechas && <p className="text-xs text-destructive">{errorFechas}</p>}
    </div>
  );
}
