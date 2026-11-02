import { Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsuarioFormulario } from "../hooks/useUsuarioFormulario";
import type { RolSelectType } from "@/features/rol/types/RolType";
import type { UsuarioType } from "../types/UsuarioType";

interface Props {
  usuario: UsuarioType | null;
  roles: RolSelectType[];
  onClose: () => void;
}

export function UsuarioModal({ usuario, roles, onClose }: Props) {
  const { form, esEdicion, guardando, onSubmit } = useUsuarioFormulario(usuario, onClose);
  const { register, control, formState: { errors } } = form;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="name" isRequired>Nombre</Label>
            <Input id="name" autoFocus {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" isRequired>Correo</Label>
            <Input id="email" type="email" autoComplete="off" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" isRequired={!esEdicion}>Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder={esEdicion ? "Déjala vacía para no cambiarla" : "Mínimo 8 caracteres"}
              {...register("password")}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <Label isRequired>Rol</Label>
            <Controller
              control={control}
              name="rol_id"
              render={({ field }) => (
                <Select value={field.value ? String(field.value) : ""} onValueChange={(valor) => field.onChange(Number(valor))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((rol) => (
                      <SelectItem key={rol.id} value={String(rol.id)}>
                        {rol.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.rol_id && <p className="text-sm text-destructive">{errors.rol_id.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
