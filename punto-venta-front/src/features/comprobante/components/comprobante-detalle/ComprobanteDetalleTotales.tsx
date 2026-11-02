import { ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { ComprobanteType } from "../../types/ComprobanteType";

interface Props {
  comprobante: ComprobanteType;
}

export function ComprobanteDetalleTotales({ comprobante }: Props) {
  const { simbolo } = useMonedaHook();
  const tieneDescuento = Number(comprobante.descuento || 0) > 0;
  const totalCreditoPendiente = (comprobante.creditos || []).reduce(
    (acc, c) => acc + Number(c.saldo_pendiente || 0),
    0
  );

  return (
    <Card className="p-3.5 sm:p-4 shadow-sm space-y-3">
      <span className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
        <ReceiptText className="h-4 w-4 text-primary" /> Resumen de Totales
      </span>
      <div className="space-y-2.5 pt-1">
        <div className="flex justify-between text-sm font-semibold text-foreground">
          <span>Subtotal</span>
          <span>{simbolo} {Number(comprobante.subtotal || 0).toFixed(2)}</span>
        </div>
       
        {tieneDescuento && (
          <div className="flex justify-between text-sm font-semibold text-foreground">
            <span>Descuento</span>
            <span>-{simbolo} {Number(comprobante.descuento || 0).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-extrabold text-xl pt-2 border-t text-foreground">
          <span>Total</span>
          <span className="text-primary">
            {simbolo} {Number(comprobante.total || 0).toFixed(2)}
          </span>
        </div>
        {totalCreditoPendiente > 0 && (
          <div className="flex justify-between text-sm font-bold text-amber-900 bg-amber-100/70 p-2 rounded border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            <span>Saldo Pendiente</span>
            <span>{simbolo} {totalCreditoPendiente.toFixed(2)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
