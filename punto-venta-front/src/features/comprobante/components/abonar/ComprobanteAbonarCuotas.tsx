import { CalendarClock, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { ComprobanteEstadoBadge } from "../ComprobanteEstadoBadge";
import type { ComprobanteCreditoType } from "../../types/ComprobanteType";

interface Props {
  cuotas: ComprobanteCreditoType[];
  cuotaSeleccionada: ComprobanteCreditoType | null;
  onSeleccionarCuota: (cuota: ComprobanteCreditoType) => void;
}

export function ComprobanteAbonarCuotas({
  cuotas,
  cuotaSeleccionada,
  onSeleccionarCuota,
}: Props) {
  const { simbolo } = useMonedaHook();
  if (cuotas.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No hay cuotas de crédito registradas en este comprobante.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 sm:p-5 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Cuotas de Crédito
          </CardTitle>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {cuotas.length} {cuotas.length === 1 ? "cuota" : "cuotas"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cuotas.map((cuota, index) => {
            const esSeleccionada = cuotaSeleccionada?.id === cuota.id;
            const tieneSaldo = Number(cuota.saldo_pendiente) > 0;
            const esPagado = cuota.estado === "pagado" || !tieneSaldo;

            return (
              <div
                key={cuota.id || index}
                onClick={() => {
                  if (!esPagado) {
                    onSeleccionarCuota(cuota);
                  }
                }}
                className={`relative p-4 rounded-xl border transition-all ${
                  esPagado
                    ? "opacity-60 bg-muted/40 border-muted cursor-not-allowed"
                    : esSeleccionada
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 cursor-pointer shadow-sm"
                    : "border-border hover:border-primary/50 bg-card cursor-pointer hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      Cuota #{index + 1}
                    </span>
                    {esSeleccionada && (
                      <Badge variant="default" className="text-[10px] h-5 gap-1 font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Seleccionada
                      </Badge>
                    )}
                  </div>
                  <ComprobanteEstadoBadge estado={cuota.estado} />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Vencimiento:</span>
                    <span className="font-semibold text-foreground">{cuota.fecha}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Monto Original:</span>
                    <span className="font-bold text-foreground">
                      {simbolo} {Number(cuota.monto).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-dashed">
                    <span className="font-bold text-foreground">Saldo Pendiente:</span>
                    <span className={`font-black text-sm ${tieneSaldo ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                      {simbolo} {Number(cuota.saldo_pendiente).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
