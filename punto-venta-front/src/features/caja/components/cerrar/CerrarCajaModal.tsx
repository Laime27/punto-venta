import type { ReactNode } from "react";
import { Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { useCajaCerrar } from "../../hooks/cerrar/useCajaCerrar";
import { CajaDiferenciaBadge } from "../general/CajaDiferenciaBadge";
import { CerrarCajaArqueo } from "./CerrarCajaArqueo";
import { CerrarCajaResultado } from "./CerrarCajaResultado";

interface Props {
  cajaId: number;
  trigger: ReactNode;
}

export function CerrarCajaModal({ cajaId, trigger }: Props) {
  const { simbolo } = useMonedaHook();
  const {
    form: {
      register,
      formState: { errors },
    },
    estado: { abierto, confirmacionAbierta, resumen, cargandoResumen, resultado, diferencia, estaEnviando },
    funciones: { cambiarAbierto, cambiarConfirmacion, solicitarConfirmacion, confirmarCierre },
  } = useCajaCerrar(cajaId);

  return (
    <>
      <Dialog open={abierto} onOpenChange={cambiarAbierto}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{resultado ? "Resultado del cierre" : "Cerrar caja (arqueo)"}</DialogTitle>
            {!resultado && (
              <DialogDescription>
                Cuenta el efectivo físico e ingrésalo para compararlo con el saldo teórico.
              </DialogDescription>
            )}
          </DialogHeader>

          {resultado ? (
            <>
              <CerrarCajaResultado resultado={resultado} />
              <DialogFooter>
                <Button onClick={() => cambiarAbierto(false)}>Aceptar</Button>
              </DialogFooter>
            </>
          ) : cargandoResumen || !resumen ? (
            <div className="h-40 animate-pulse rounded-lg bg-muted" />
          ) : (
            <form onSubmit={solicitarConfirmacion} className="space-y-4">
              <CerrarCajaArqueo resumen={resumen} />

              <div className="space-y-1">
                <Label htmlFor="monto_real">
                  Efectivo contado ({simbolo}) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="monto_real"
                  type="number"
                  step="0.01"
                  min="0"
                  autoFocus
                  {...register("monto_real", { valueAsNumber: true })}
                />
                {errors.monto_real && <p className="text-sm text-destructive">{errors.monto_real.message}</p>}
              </div>

              {diferencia !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Diferencia</span>
                  <CajaDiferenciaBadge diferencia={diferencia} mostrarEtiqueta />
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="observaciones_cierre">Observaciones</Label>
                <Textarea id="observaciones_cierre" rows={2} placeholder="Opcional" {...register("observaciones")} />
                {errors.observaciones && (
                  <p className="text-sm text-destructive">{errors.observaciones.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => cambiarAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="destructive" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Cerrar caja
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmacionAbierta} onOpenChange={cambiarConfirmacion}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar la caja?</AlertDialogTitle>
            <AlertDialogDescription>
              Una vez cerrada no podrás registrar más ventas ni movimientos en esta caja.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {diferencia !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Diferencia del arqueo</span>
              <CajaDiferenciaBadge diferencia={diferencia} mostrarEtiqueta />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={estaEnviando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmarCierre();
              }}
              disabled={estaEnviando}
              className="gap-2 bg-destructive text-white hover:bg-destructive/90"
            >
              {estaEnviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Sí, cerrar caja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
