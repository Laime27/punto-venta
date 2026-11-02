import { Search, RotateCcw, Calendar, CheckCircle2, CalendarDays, User, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/SearchableSelect";
import { listarSelectCliente } from "@/features/cliente/services/ClienteService";
import type { FiltrosComprobanteType } from "../types/ComprobanteType";
import { useComprobanteFilters } from "../hooks/useComprobanteFilters";

interface Props {
  search: string;
  setSearch: (term: string) => void;
  filtros: FiltrosComprobanteType;
  setFiltros: (nuevosFiltros: Partial<FiltrosComprobanteType>) => void;
  onLimpiar: () => void;
}

export function ComprobanteFilters({
  search,
  setSearch,
  filtros,
  setFiltros,
  onLimpiar,
}: Props) {
  const {
    periodo,
    estados,
    formasPago,
    periodos,
    tieneFiltrosActivos,
    aplicarPeriodo,
    cambiarFechaInicio,
    cambiarFechaFin,
    handleLimpiar,
  } = useComprobanteFilters({
    search,
    filtros,
    setFiltros,
    onLimpiar,
  });

  return (
    <div className="flex flex-wrap xl:flex-nowrap items-end gap-3">
      <div className="space-y-1.5 w-full sm:w-[210px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Search className="h-4 w-4" />
          Serie y correlativo
        </Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Ej: B001-001000..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 text-sm font-medium text-foreground pr-8"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground font-bold text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5 w-full sm:w-[160px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          Estado
        </Label>
        <Select
          value={filtros.estado || "todos"}
          onValueChange={(val) =>
            setFiltros({
              estado: val === "todos" ? "todos" : val,
            })
          }
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
          <CreditCard className="h-4 w-4" />
          Forma de Pago
        </Label>
        <Select
          value={filtros.forma_pago || "todos"}
          onValueChange={(val) =>
            setFiltros({
              forma_pago: val === "todos" ? "todos" : val,
            })
          }
        >
          <SelectTrigger className="h-10 text-sm font-medium text-foreground">
            <SelectValue placeholder="Forma de Pago" />
          </SelectTrigger>
          <SelectContent>
            {formasPago.map((item) => (
              <SelectItem key={item.id} value={item.id} className="text-sm font-medium">
                {item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 flex-1 min-w-[200px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <User className="h-4 w-4" />
          Cliente
        </Label>
        <SearchableSelect
          value={filtros.cliente_id ?? null}
          onChange={(val) => setFiltros({ cliente_id: val })}
          queryKey="select-clientes-comprobantes"
          fetchFn={listarSelectCliente}
          placeholder="Todos los clientes"
          searchPlaceholder="Buscar cliente..."
          allowClear
          clearText="Todos los clientes"
        />
      </div>

      <div className="space-y-1.5 w-full sm:w-[150px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          Período
        </Label>
        <Select value={periodo} onValueChange={aplicarPeriodo}>
          <SelectTrigger className="h-10 text-sm font-medium text-foreground">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {periodos.map((item) => (
              <SelectItem key={item.id} value={item.id} className="text-sm font-medium">
                {item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 w-full sm:w-[140px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Desde
        </Label>
        <Input
          type="date"
          value={filtros.fecha_inicio || ""}
          onChange={(e) => cambiarFechaInicio(e.target.value)}
          className="h-10 text-sm font-medium text-foreground"
        />
      </div>

      <div className="space-y-1.5 w-full sm:w-[140px]">
        <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Hasta
        </Label>
        <Input
          type="date"
          value={filtros.fecha_fin || ""}
          onChange={(e) => cambiarFechaFin(e.target.value)}
          className="h-10 text-sm font-medium text-foreground"
        />
      </div>

      {tieneFiltrosActivos && (
        <div className="shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLimpiar}
            className="h-10 text-sm font-bold gap-1.5 text-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      )}
    </div>
  );
}
