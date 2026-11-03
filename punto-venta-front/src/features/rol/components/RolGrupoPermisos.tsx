import { Checkbox } from "@/components/ui/checkbox";
import type { EstadoGrupo } from "../hooks/useRolFormulario";
import type { GrupoPermisosType } from "../types/RolType";

interface Props {
  grupo: GrupoPermisosType;
  estado: EstadoGrupo;
  seleccionados: Set<number>;
  deshabilitado: boolean;
  onAlternarGrupo: () => void;
  onAlternarPermiso: (permisoId: number) => void;
}

export function RolGrupoPermisos({ grupo, estado, seleccionados, deshabilitado, onAlternarGrupo, onAlternarPermiso }: Props) {
  return (
    <div>
      <label className="flex cursor-pointer items-center justify-between gap-3 border-b px-4 py-3">
        <span className="text-sm font-semibold">Marcar todo el grupo {grupo.nombre}</span>
        <Checkbox checked={estado} onCheckedChange={onAlternarGrupo} disabled={deshabilitado} />
      </label>
      <div className="divide-y">
        {grupo.permisos.map((permiso) => (
          <label key={permiso.id} className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted/40">
            <span className="flex items-center gap-2 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              {permiso.descripcion}
            </span>
            <Checkbox
              checked={seleccionados.has(permiso.id)}
              onCheckedChange={() => onAlternarPermiso(permiso.id)}
              disabled={deshabilitado}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
