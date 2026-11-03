import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RolGrupoPermisos } from "./RolGrupoPermisos";
import { RolGruposTabs } from "./RolGruposTabs";
import type { EstadoGrupo } from "../hooks/useRolFormulario";
import type { GrupoPermisosType } from "../types/RolType";
import type { RolFormValues } from "../validations/RolValidation";

interface Props {
  form: UseFormReturn<RolFormValues>;
  grupos: GrupoPermisosType[];
  guardando: boolean;
  esEdicion: boolean;
  seleccion: {
    seleccionados: Set<number>;
    totalSeleccionados: number;
    totalPermisos: number;
    grupoActivo?: GrupoPermisosType;
    seleccionarGrupo: (grupoId: number) => void;
    estadoGrupo: (grupo: GrupoPermisosType) => EstadoGrupo;
    alternarPermiso: (permisoId: number) => void;
    alternarGrupo: (grupo: GrupoPermisosType) => void;
    alternarTodos: () => void;
  };
  onSubmit: () => void;
  onCancelar: () => void;
}

export function RolFormulario({ form, grupos, guardando, esEdicion, seleccion, onSubmit, onCancelar }: Props) {
  const { register, formState: { errors } } = form;
  const todosMarcados = seleccion.totalSeleccionados === seleccion.totalPermisos && seleccion.totalPermisos > 0;
  const { grupoActivo } = seleccion;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-[280px_1fr]">
          <div className="space-y-1.5">
            <Label htmlFor="name" isRequired>Nombre del rol</Label>
            <Input id="name" placeholder="Ej. Supervisor" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input id="descripcion" placeholder="Qué tareas realiza este rol" {...register("descripcion")} />
            {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion.message}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Permisos</h2>
          <p className="text-sm text-muted-foreground">
            {seleccion.totalSeleccionados} de {seleccion.totalPermisos} permisos seleccionados
          </p>
          {errors.permisos && <p className="text-xs text-destructive">{errors.permisos.message}</p>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={seleccion.alternarTodos}>
          {todosMarcados ? "Quitar todos" : "Marcar todos"}
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <RolGruposTabs
          grupos={grupos}
          grupoActivoId={grupoActivo?.id}
          seleccionados={seleccion.seleccionados}
          onSeleccionar={seleccion.seleccionarGrupo}
        />
        {grupoActivo && (
          <RolGrupoPermisos
            grupo={grupoActivo}
            estado={seleccion.estadoGrupo(grupoActivo)}
            seleccionados={seleccion.seleccionados}
            deshabilitado={guardando}
            onAlternarGrupo={() => seleccion.alternarGrupo(grupoActivo)}
            onAlternarPermiso={seleccion.alternarPermiso}
          />
        )}
      </Card>

      <div className="flex justify-end gap-3 pb-6">
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : esEdicion ? "Actualizar rol" : "Crear rol"}
        </Button>
      </div>
    </form>
  );
}
