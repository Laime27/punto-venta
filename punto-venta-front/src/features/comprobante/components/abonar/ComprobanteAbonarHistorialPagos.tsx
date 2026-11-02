import { History, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { ComprobantePagoType } from "../../types/ComprobanteType";

interface Props {
  pagos?: ComprobantePagoType[];
}

export function ComprobanteAbonarHistorialPagos({
  pagos = [],
}: Props) {
  const { simbolo } = useMonedaHook();
  const totalPagado = Number(
    pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0).toFixed(2)
  );

 
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 sm:p-5 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Pagos Ya Realizados
          </CardTitle>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {pagos.length} {pagos.length === 1 ? "pago" : "pagos"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Total Abonado Previo:
          </span>
          <span className="font-black text-sm text-emerald-700 dark:text-emerald-300">
            {simbolo} {totalPagado.toFixed(2)}
          </span>
        </div>

        {pagos.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            No se han registrado pagos previos para este comprobante.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {pagos.map((pago, index) => (
              <div
                key={pago.id || index}
                className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20 text-xs"
              >
                <div className="space-y-0.5">
                  <Badge
                    variant="outline"
                    className="font-bold text-xs bg-background text-foreground"
                  >
                    {pago.metodo_pago?.nombre || ""}
                  </Badge>
                </div>
                <span className="font-extrabold text-sm text-foreground">
                  {simbolo} {Number(pago.monto || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
