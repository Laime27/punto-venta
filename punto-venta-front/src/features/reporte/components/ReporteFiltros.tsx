import { Calendar, CalendarRange, FolderTree, Package, UserRound, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SearchableSelect } from "@/components/SearchableSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { listarSelectCategoria } from "@/features/categoria/services/CategoriaService";
import { listarSelectProductos } from "@/features/producto/services/ProductoService";
import { listarSelectCliente } from "@/features/cliente/services/ClienteService";
import { listarVendedores } from "../services/ReporteService";
import type { FiltrosDisponibles, FiltrosReporteType, PeriodoId } from "../types/ReporteType";

interface Props {
  disponibles: FiltrosDisponibles;
  filtros: {
    valores: FiltrosReporteType;
    periodos: { id: PeriodoId; nombre: string }[];
    periodoActivo?: PeriodoId;
    errorFechas: string | null;
    cambiarFiltros: (nuevos: Partial<FiltrosReporteType>) => void;
    cambiarPeriodo: (periodo: PeriodoId) => void;
  };
}

export function ReporteFiltros({ disponibles, filtros }: Props) {
  const { valores, periodos, periodoActivo, errorFechas, cambiarFiltros, cambiarPeriodo } = filtros;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        {disponibles.fechas && (
          <>
            <div className="space-y-1.5 w-full sm:w-[170px]">
              <Label className="text-sm font-bold flex items-center gap-1.5">
                <CalendarRange className="h-4 w-4" />
                Periodo
              </Label>
              <Select value={periodoActivo ?? ""} onValueChange={(valor) => cambiarPeriodo(valor as PeriodoId)}>
                <SelectTrigger className="h-10 text-sm w-full">
                  <SelectValue placeholder="Rango de fechas" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((periodo) => (
                    <SelectItem key={periodo.id} value={periodo.id}>
                      {periodo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 w-full sm:w-[160px]">
              <Label className="text-sm font-bold flex items-center gap-1.5">
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
              <Label className="text-sm font-bold flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Hasta
              </Label>
              <Input
                type="date"
                value={valores.fecha_fin}
                onChange={(e) => cambiarFiltros({ fecha_fin: e.target.value })}
                className={cn("h-10 text-sm", errorFechas && "border-destructive")}
              />
            </div>
          </>
        )}

        {disponibles.vendedor && (
          <div className="space-y-1.5 w-full sm:w-[220px]">
            <Label className="text-sm font-bold flex items-center gap-1.5">
              <UserRound className="h-4 w-4" />
              Vendedor
            </Label>
            <SearchableSelect
              value={valores.user_id}
              onChange={(userId) => cambiarFiltros({ user_id: userId })}
              queryKey="selectVendedoresReporte"
              fetchFn={listarVendedores}
              placeholder="Todos los vendedores"
              searchPlaceholder="Buscar vendedor..."
              allowClear
              clearText="Todos los vendedores"
            />
          </div>
        )}

        {disponibles.categoria && (
          <div className="space-y-1.5 w-full sm:w-[220px]">
            <Label className="text-sm font-bold flex items-center gap-1.5">
              <FolderTree className="h-4 w-4" />
              Categoría
            </Label>
            <SearchableSelect
              value={valores.categoria_id}
              onChange={(categoriaId) => cambiarFiltros({ categoria_id: categoriaId })}
              queryKey="selectCategoriasReporte"
              fetchFn={listarSelectCategoria}
              placeholder="Todas las categorías"
              searchPlaceholder="Buscar categoría..."
              allowClear
              clearText="Todas las categorías"
            />
          </div>
        )}

        {disponibles.producto && (
          <div className="space-y-1.5 w-full sm:w-[240px]">
            <Label className="text-sm font-bold flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              Producto
            </Label>
            <SearchableSelect
              value={valores.producto_id}
              onChange={(productoId) => cambiarFiltros({ producto_id: productoId })}
              queryKey="selectProductosReporte"
              fetchFn={listarSelectProductos}
              placeholder="Todos los productos"
              searchPlaceholder="Buscar por nombre o código..."
              allowClear
              clearText="Todos los productos"
            />
          </div>
        )}

        {disponibles.cliente && (
          <div className="space-y-1.5 w-full sm:w-[240px]">
            <Label className="text-sm font-bold flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Cliente
            </Label>
            <SearchableSelect
              value={valores.cliente_id}
              onChange={(clienteId) => cambiarFiltros({ cliente_id: clienteId })}
              queryKey="selectClientesReporte"
              fetchFn={listarSelectCliente}
              placeholder="Todos los clientes"
              searchPlaceholder="Buscar cliente..."
              allowClear
              clearText="Todos los clientes"
            />
          </div>
        )}

        {disponibles.stockBajo && (
          <label className="flex h-10 items-center gap-2 text-sm font-medium">
            <Switch
              checked={valores.solo_stock_bajo}
              onCheckedChange={(activo) => cambiarFiltros({ solo_stock_bajo: activo })}
            />
            Solo stock bajo
          </label>
        )}
      </div>

      {disponibles.fechas && errorFechas && <p className="text-xs text-destructive">{errorFechas}</p>}
    </div>
  );
}
