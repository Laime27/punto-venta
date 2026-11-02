import { Loader2, LockOpen } from "lucide-react";
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
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { useCajaAbrir } from "../../hooks/abrir/useCajaAbrir";

export function AbrirCajaModal() {
  const { simbolo } = useMonedaHook();
  const {
    form: {
      register,
      formState: { errors },
    },
    estado: { abierto, estaEnviando },
    funciones: { cambiarAbierto, guardar },
  } = useCajaAbrir();

  return (
    <Dialog open={abierto} onOpenChange={cambiarAbierto}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <LockOpen className="h-4 w-4" />
          Abrir caja
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Abrir caja</DialogTitle>
          <DialogDescription>Ingresa el efectivo inicial con el que comienza la caja.</DialogDescription>
        </DialogHeader>

        <form onSubmit={guardar} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="monto_apertura">
              Monto de apertura ({simbolo}) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="monto_apertura"
              type="number"
              step="0.01"
              min="0"
              autoFocus
              {...register("monto_apertura", { valueAsNumber: true })}
            />
            {errors.monto_apertura && (
              <p className="text-sm text-destructive">{errors.monto_apertura.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="observaciones_apertura">Observaciones</Label>
            <Textarea id="observaciones_apertura" rows={3} placeholder="Opcional" {...register("observaciones")} />
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
              {estaEnviando ? "Abriendo..." : "Abrir caja"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
