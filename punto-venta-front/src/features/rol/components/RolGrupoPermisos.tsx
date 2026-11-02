import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  const marcados = grupo.permisos.filter((permiso) => seleccionados.has(permiso.id)).length;

  return (
    <Card className={estado ? "border-primary/40" : ""}>
      <CardHeader className="pb-3">
        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox checked={estado} onCheckedChange={onAlternarGrupo} disabled={deshabilitado} />
          <span className="flex-1 font-semibold">{grupo.nombre}</span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {marcados}/{grupo.permisos.length}
          </span>
        </label>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        {grupo.permisos.map((permiso) => (
          <label key={permiso.id} className="flex cursor-pointer items-center gap-3 pl-1 text-sm">
            <Checkbox
              checked={seleccionados.has(permiso.id)}
              onCheckedChange={() => onAlternarPermiso(permiso.id)}
              disabled={deshabilitado}
            />
            <span className="text-foreground/90">{permiso.descripcion}</span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
