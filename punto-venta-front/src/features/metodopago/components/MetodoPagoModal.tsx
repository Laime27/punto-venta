import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetodoPagoSchema, type MetodoPagoFormData } from "../validations/MetodopagoValidation";
import type { MetodoPagoType } from "../types/MetodopagoType";

interface MetodoPagoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { nombre: string; tipo: string }) => Promise<void>;
  metodoPago?: MetodoPagoType | null;
}

export function MetodoPagoModal({ open, onClose, onSubmit, metodoPago }: MetodoPagoModalProps) {
  const isEdit = !!metodoPago;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MetodoPagoFormData>({
    resolver: zodResolver(MetodoPagoSchema),
    defaultValues: { nombre: "", tipo: "efectivo" as const },
  });

  useEffect(() => {
    if (open) reset({ 
      nombre: metodoPago?.nombre ?? "",
      tipo: (metodoPago?.tipo ?? "efectivo") as MetodoPagoType["tipo"]
    });
  }, [open, metodoPago, reset]);

  const onFormSubmit = async (values: MetodoPagoFormData) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar método de pago" : "Nuevo método de pago"}</DialogTitle>
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
          
          <div className="space-y-1">
            <Label>Tipo</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo && (
              <p className="text-sm text-destructive">{errors.tipo.message}</p>
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
