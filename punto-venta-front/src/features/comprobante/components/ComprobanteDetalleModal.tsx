import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Receipt } from "lucide-react";
import { useComprobanteDetalle } from "../hooks/useComprobanteDetalle";
import { ComprobanteEstadoBadge } from "./ComprobanteEstadoBadge";
import { ComprobanteDetalleInfoGeneral } from "./comprobante-detalle/ComprobanteDetalleInfoGeneral";
import { ComprobanteDetalleProductos } from "./comprobante-detalle/ComprobanteDetalleProductos";
import { ComprobanteDetalleCreditos } from "./comprobante-detalle/ComprobanteDetalleCreditos";
import { ComprobanteDetallePagos } from "./comprobante-detalle/ComprobanteDetallePagos";
import { ComprobanteDetalleTotales } from "./comprobante-detalle/ComprobanteDetalleTotales";

interface Props {
  open: boolean;
  comprobanteId: number | null;
  onClose: () => void;
}

export function ComprobanteDetalleModal({
  open,
  comprobanteId,
  onClose,
}: Props) {
  const { data: comprobante, isLoading } = useComprobanteDetalle(comprobanteId);

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <DialogContent className="w-[95vw] sm:max-w-5xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-3 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pr-8 sm:pr-6">
              <div className="flex items-center gap-2 min-w-0">
                <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                <DialogTitle className="text-xl sm:text-2xl font-black text-foreground truncate">
                  {comprobante ? `${comprobante.serie}-${comprobante.correlativo}` : "Detalle del Comprobante"}
                </DialogTitle>
              </div>
              {comprobante && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="font-bold text-xs px-2.5 py-1 bg-muted text-foreground"
                  >
                    {comprobante.tipo_comprobante?.nombre || "Venta"}
                  </Badge>
                  {comprobante.forma_pago && (
                    <Badge
                      variant="outline"
                      className={`font-bold text-xs px-2.5 py-1 uppercase ${
                        comprobante.forma_pago === "credito"
                          ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                      }`}
                    >
                      {comprobante.forma_pago}
                    </Badge>
                  )}
                  <ComprobanteEstadoBadge estado={comprobante.estado} />
                </div>
              )}
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-base font-semibold text-foreground">
                Cargando información de la venta...
              </p>
            </div>
          ) : !comprobante ? (
            <div className="py-12 text-center text-base font-medium text-muted-foreground">
              No se pudo cargar la información del comprobante.
            </div>
          ) : (
            <div className="space-y-6 py-2">
              <ComprobanteDetalleInfoGeneral comprobante={comprobante} />
              <ComprobanteDetalleProductos detalles={comprobante.detalles} />
              <ComprobanteDetalleCreditos
                creditos={comprobante.creditos}
                comprobanteId={comprobante.id}
                comprobanteEstado={comprobante.estado}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComprobanteDetallePagos pagos={comprobante.pagos} />
                <ComprobanteDetalleTotales comprobante={comprobante} />
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 border-t flex-col-reverse sm:flex-row sm:justify-between gap-2">
           
            <Button
              type="button"
              onClick={onClose}
              className="px-6 h-10 text-sm font-bold w-full sm:w-auto"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
