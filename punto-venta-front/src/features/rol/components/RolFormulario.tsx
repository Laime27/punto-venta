import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RolGrupoPermisos } from "./RolGrupoPermisos";
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grupos.map((grupo) => (
          <RolGrupoPermisos
            key={grupo.id}
            grupo={grupo}
            estado={seleccion.estadoGrupo(grupo)}
            seleccionados={seleccion.seleccionados}
            deshabilitado={guardando}
            onAlternarGrupo={() => seleccion.alternarGrupo(grupo)}
            onAlternarPermiso={seleccion.alternarPermiso}
          />
        ))}
      </div>

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
