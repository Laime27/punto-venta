import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { ComprobantePagoType } from "../../types/ComprobanteType";

interface Props {
  pagos?: ComprobantePagoType[];
}

export function ComprobanteDetallePagos({ pagos }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <Card className="p-3.5 sm:p-4 shadow-sm space-y-3">
      <span className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
        <CreditCard className="h-4 w-4 text-primary" /> Pagos Realizados
      </span>
      <div className="space-y-2 divide-y">
        {pagos && pagos.length > 0 ? (
          pagos.map((pago) => (
            <div key={pago.id} className="pt-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="font-semibold text-sm px-2.5 py-1 bg-muted/50 text-foreground"
                >
                  {pago.metodo_pago?.nombre || "Método de Pago"}
                </Badge>
              </div>
              <span className="font-bold text-sm text-foreground">
                {simbolo} {Number(pago.monto).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm font-medium text-foreground pt-1">
            Sin detalles de pagos
          </p>
        )}
      </div>
    </Card>
  );
}
