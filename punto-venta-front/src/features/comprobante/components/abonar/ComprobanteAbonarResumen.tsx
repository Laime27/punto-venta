import { User, Receipt, DollarSign, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { ComprobanteType, ComprobanteCreditoType } from "../../types/ComprobanteType";

interface Props {
  comprobante: ComprobanteType | null;
  cuotaSeleccionada: ComprobanteCreditoType | null;
  saldoPendienteCuota: number;
  totalAbonado: number;
  saldoRestante: number;
  saldoTotalComprobante: number;
  estaEnviando: boolean;
  puedeRegistrarAbono: boolean;
  onRegistrarAbono: () => void;
  onVolver: () => void;
}

export function ComprobanteAbonarResumen({
  comprobante,
  cuotaSeleccionada,
  saldoPendienteCuota,
  totalAbonado,
  saldoRestante,
  saldoTotalComprobante,
  estaEnviando,
  puedeRegistrarAbono,
  onRegistrarAbono,
  onVolver,
}: Props) {
  const { simbolo } = useMonedaHook();
  const totalYaPagado = Number(
    (comprobante?.pagos || []).reduce((acc, p) => acc + Number(p.monto || 0), 0).toFixed(2)
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 sm:p-5 border-b">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          Resumen de Cobro
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground pb-1">
            <User className="h-4 w-4 text-primary" />
            <span className="font-bold uppercase tracking-wider">Cliente</span>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 space-y-1">
            <p className="font-bold text-sm text-foreground">
              {comprobante?.cliente?.nombre || "Cliente General"}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Fecha Emisión:</span>
            <span className="font-semibold text-foreground">
              {comprobante?.fecha_emision || "-"}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Total Venta:</span>
            <span className="font-bold text-foreground">
              {simbolo} {Number(comprobante?.total || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Total Ya Pagado:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {simbolo} {totalYaPagado.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Deuda Total Venta:</span>
            <span className="font-extrabold text-foreground">
              {simbolo} {saldoTotalComprobante.toFixed(2)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Cuota a abonar:</span>
            <span className="font-bold text-foreground">
              {cuotaSeleccionada ? `Vence ${cuotaSeleccionada.fecha}` : "Ninguna"}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Saldo Cuota:</span>
            <span className="font-bold text-foreground">
              {simbolo} {saldoPendienteCuota.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
            <span>Total a Abonar:</span>
            <span className="text-base font-black">
              {simbolo} {totalAbonado.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground pt-1 border-t border-dashed">
            <span>Saldo Restante:</span>
            <span className="font-extrabold text-sm text-foreground">
              {simbolo} {saldoRestante.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0 flex-col gap-2">
        <Button
          type="button"
          onClick={onRegistrarAbono}
          disabled={!puedeRegistrarAbono || estaEnviando}
          className="w-full h-11 font-bold gap-2 text-sm shadow-sm"
        >
          {estaEnviando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando Abono...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4" />
              Confirmar Abono
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onVolver}
          disabled={estaEnviando}
          className="w-full h-10 font-semibold gap-1 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a Comprobantes
        </Button>
      </CardFooter>
    </Card>
  );
}
