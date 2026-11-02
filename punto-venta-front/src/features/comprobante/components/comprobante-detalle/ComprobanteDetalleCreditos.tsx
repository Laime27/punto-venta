import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { ComprobanteCreditoType } from "../../types/ComprobanteType";
import { ComprobanteEstadoBadge } from "../ComprobanteEstadoBadge";

interface Props {
  creditos?: ComprobanteCreditoType[];
  comprobanteId?: number;
  comprobanteEstado?: string;
}

export function ComprobanteDetalleCreditos({
  creditos,
}: Props) {
  const { simbolo } = useMonedaHook();
  if (!creditos || creditos.length === 0) return null;

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="p-3.5 sm:p-4 border-b bg-card flex items-center justify-between">
        <span className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
          <CalendarClock className="h-4 w-4 text-primary" /> Crédito y Cuotas de Pago
        </span>
        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {creditos.length} {creditos.length === 1 ? "cuota" : "cuotas"}
        </span>
      </div>

      <div className="divide-y sm:hidden max-h-72 overflow-y-auto">
        {creditos.map((cuota, index) => (
          <div key={cuota.id || index} className="p-3.5 space-y-2 bg-card">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs px-2 py-0.5 rounded bg-muted text-foreground">
                Cuota #{index + 1}
              </span>
              <ComprobanteEstadoBadge estado={cuota.estado || ""} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Vencimiento</span>
                <span className="font-semibold text-foreground">{cuota.fecha}</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block text-[11px]">Monto</span>
                <span className="font-bold text-foreground">
                  {simbolo} {Number(cuota.monto).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-dashed">
              <span className="text-muted-foreground">Saldo Pendiente:</span>
              <span className="font-extrabold text-foreground">
                {simbolo} {Number(cuota.saldo_pendiente).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <div className="min-w-[540px]">
          <div className="grid grid-cols-[50px_1fr_130px_130px_110px] gap-2 px-4 py-3 bg-muted text-sm font-bold text-foreground border-b">
            <div className="text-center">#</div>
            <div>VENCIMIENTO</div>
            <div className="text-right">MONTO</div>
            <div className="text-right">SALDO PENDIENTE</div>
            <div className="text-center">ESTADO</div>
          </div>

          <div className="divide-y max-h-56 overflow-y-auto">
            {creditos.map((cuota, index) => (
              <div
                key={cuota.id || index}
                className="grid grid-cols-[50px_1fr_130px_130px_110px] gap-2 px-4 py-3 items-center text-sm"
              >
                <div className="text-center font-bold text-foreground">
                  {index + 1}
                </div>
                <div className="font-semibold text-foreground">
                  {cuota.fecha}
                </div>
                <div className="text-right font-bold text-foreground">
                  {simbolo} {Number(cuota.monto).toFixed(2)}
                </div>
                <div className="text-right font-extrabold text-foreground">
                  {simbolo} {Number(cuota.saldo_pendiente).toFixed(2)}
                </div>
                <div className="text-center">
                  <ComprobanteEstadoBadge estado={cuota.estado || ""} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
