import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Ban } from "lucide-react";
import { useAnularComprobante } from "../hooks/useAnularComprobante";
import type { ComprobanteType } from "../types/ComprobanteType";

interface AnularComprobanteModalProps {
  open?: boolean;
  abierto?: boolean;
  comprobante: ComprobanteType | null;
  onClose?: () => void;
  alCerrar?: () => void;
  onSuccess?: () => void;
  alExito?: () => void;
}

export function AnularComprobanteModal({
  open,
  abierto,
  comprobante,
  onClose,
  alCerrar,
  onSuccess,
  alExito,
}: AnularComprobanteModalProps) {
  const estaAbierto = abierto ?? open ?? false;
  const funcionCerrar = alCerrar ?? onClose ?? (() => {});
  const funcionExito = alExito ?? onSuccess;

  const {
    motivo,
    setMotivo,
    estaEnviando,
    cerrarModal,
    confirmarAnulacion,
  } = useAnularComprobante({
    comprobante,
    alCerrar: funcionCerrar,
    alExito: funcionExito,
  });

  if (!comprobante) return null;

  return (
    <Dialog open={estaAbierto} onOpenChange={(val) => !val && cerrarModal()}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-5 sm:p-6 rounded-xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <Ban className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold">
              Anular Comprobante {comprobante.serie}-{comprobante.correlativo}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Revierte el stock de los productos, registra movimientos en el Kardex y anula cuotas de crédito activas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={confirmarAnulacion} className="space-y-4 pt-2">
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2.5 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. Los productos volverán al stock y el comprobante pasará a estado <strong>anulado</strong>.
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="motivo" className="text-sm font-bold text-foreground">
              Motivo de anulación <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="motivo"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: Cliente solicitó devolución por producto defectuoso..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              disabled={estaEnviando}
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={cerrarModal}
              disabled={estaEnviando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={estaEnviando || !motivo.trim()}
              className="gap-2 font-bold"
            >
              {estaEnviando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Anulando...
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  Confirmar Anulación
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
