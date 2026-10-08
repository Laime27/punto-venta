import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProveedorSchema, type ProveedorFormData } from "../validations/ProveedorValidation";
import type { ProveedorType } from "../types/ProveedorType";

interface ProveedorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProveedorFormData) => Promise<void>;
  proveedor?: ProveedorType | null;
}

export function ProveedorModal({ open, onClose, onSubmit, proveedor }: ProveedorModalProps) {
  const isEdit = !!proveedor;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProveedorFormData>({
    resolver: zodResolver(ProveedorSchema),
    defaultValues: { nombre: "", correo: "", telefono: "", direccion: "", nota: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        nombre: proveedor?.nombre ?? "",
        correo: proveedor?.correo ?? "",
        telefono: proveedor?.telefono ?? "",
        direccion: proveedor?.direccion ?? "",
        nota: proveedor?.nota ?? "",
      });
    }
  }, [open, proveedor, reset]);

  const onFormSubmit = async (values: ProveedorFormData) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" autoFocus {...register("nombre")} />
            {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="correo">Correo electrónico</Label>
            <Input id="correo" type="email" {...register("correo")} />
            {errors.correo && <p className="text-sm text-destructive">{errors.correo.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" {...register("telefono")} />
            {errors.telefono && <p className="text-sm text-destructive">{errors.telefono.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" {...register("direccion")} />
            {errors.direccion && <p className="text-sm text-destructive">{errors.direccion.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="nota">Nota</Label>
            <Textarea id="nota" {...register("nota")} maxLength={255} className="resize-none" rows={3} />
            {errors.nota && <p className="text-sm text-destructive">{errors.nota.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
