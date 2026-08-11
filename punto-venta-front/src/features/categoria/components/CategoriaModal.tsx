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
import { Label } from "@/components/ui/label";
import { CategoriaSchema, type CategoriaFormData } from "../validations/CategoriaValidation";
import type { CategoriaType } from "../types/CategoriaType";

interface CategoriaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (nombre: string) => Promise<void>;
  categoria?: CategoriaType | null;
}

export function CategoriaModal({ open, onClose, onSubmit, categoria }: CategoriaModalProps) {
  const isEdit = !!categoria;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(CategoriaSchema),
    defaultValues: { nombre: "" },
  });

  useEffect(() => {
    if (open) reset({ nombre: categoria?.nombre ?? "" });
  }, [open, categoria, reset]);

  const onFormSubmit = async (values: CategoriaFormData) => {
    await onSubmit(values.nombre);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              autoFocus
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
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
