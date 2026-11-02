import type { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { useCajaMovimiento } from "../../hooks/movimiento/useCajaMovimiento";

interface Props {
  trigger: ReactNode;
}

export function RegistrarMovimientoModal({ trigger }: Props) {
  const { simbolo } = useMonedaHook();
  const {
    form: {
      register,
      control,
      formState: { errors },
    },
    estado: { abierto, estaEnviando },
    funciones: { cambiarAbierto, guardar },
  } = useCajaMovimiento();

  return (
    <Dialog open={abierto} onOpenChange={cambiarAbierto}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>Registra un ingreso o egreso de efectivo en la caja abierta.</DialogDescription>
        </DialogHeader>

        <form onSubmit={guardar} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
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
                      <SelectItem value="ingreso">Ingreso</SelectItem>
                      <SelectItem value="egreso">Egreso</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo && <p className="text-sm text-destructive">{errors.tipo.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="monto_movimiento">
                Monto ({simbolo}) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="monto_movimiento"
                type="number"
                step="0.01"
                min="0"
                {...register("monto", { valueAsNumber: true })}
              />
              {errors.monto && <p className="text-sm text-destructive">{errors.monto.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="motivo_movimiento">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="motivo_movimiento"
              placeholder="Ej: Pago de delivery, cambio de sencillo..."
              {...register("motivo")}
            />
            {errors.motivo && <p className="text-sm text-destructive">{errors.motivo.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="observaciones_movimiento">Observaciones</Label>
            <Textarea id="observaciones_movimiento" rows={3} placeholder="Opcional" {...register("observaciones")} />
            {errors.observaciones && (
              <p className="text-sm text-destructive">{errors.observaciones.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => cambiarAbierto(false)} disabled={estaEnviando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={estaEnviando} className="gap-2">
              {estaEnviando && <Loader2 className="h-4 w-4 animate-spin" />}
              {estaEnviando ? "Guardando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
