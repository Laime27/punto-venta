import { CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RolSelectType } from "@/features/rol/types/RolType";
import type { FiltroActivo, FiltrosUsuarioType } from "../types/UsuarioType";

interface Props {
  roles: RolSelectType[];
  filtros: {
    valores: FiltrosUsuarioType;
    cambiarFiltros: (nuevos: Partial<FiltrosUsuarioType>) => void;
  };
}

export function UsuarioFilters({ roles, filtros }: Props) {
  const { valores, cambiarFiltros } = filtros;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5 w-full sm:w-[260px]">
        <Label className="text-sm font-bold flex items-center gap-1.5">
          <Search className="h-4 w-4" />
          Buscar
        </Label>
        <Input
          value={valores.search}
          onChange={(e) => cambiarFiltros({ search: e.target.value })}
          placeholder="Nombre o correo..."
          className="h-10 text-sm"
        />
      </div>

      <div className="space-y-1.5 w-full sm:w-[200px]">
        <Label className="text-sm font-bold flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          Rol
        </Label>
        <Select
          value={valores.rol_id ? String(valores.rol_id) : "todos"}
          onValueChange={(valor) => cambiarFiltros({ rol_id: valor === "todos" ? null : Number(valor) })}
        >
          <SelectTrigger className="h-10 text-sm w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            {roles.map((rol) => (
              <SelectItem key={rol.id} value={String(rol.id)}>
                {rol.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 w-full sm:w-[160px]">
        <Label className="text-sm font-bold flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          Estado
        </Label>
        <Select value={valores.activo} onValueChange={(valor) => cambiarFiltros({ activo: valor as FiltroActivo })}>
          <SelectTrigger className="h-10 text-sm w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="1">Activos</SelectItem>
            <SelectItem value="0">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
