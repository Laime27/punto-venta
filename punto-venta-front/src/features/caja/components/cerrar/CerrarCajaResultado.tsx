import { CheckCircle2 } from "lucide-react";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { CajaDiferenciaBadge } from "../general/CajaDiferenciaBadge";
import type { CajaCierreResultado } from "../../types/CajaType";

interface Props {
  resultado: CajaCierreResultado;
}

export function CerrarCajaResultado({ resultado }: Props) {
  const { simbolo } = useMonedaHook();
  const { caja, resumen } = resultado;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <p className="text-lg font-bold">Caja #{caja.id} cerrada</p>
        <p className="text-sm text-muted-foreground">
          {caja.fecha_apertura} — {caja.fecha_cierre}
        </p>
      </div>

      <div className="space-y-2 rounded-lg border bg-muted/30 p-3.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total ventas</span>
          <span className="font-semibold">{simbolo} {resumen.ventas.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Saldo teórico</span>
          <span className="font-semibold">{simbolo} {resumen.saldo_teorico.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-black">
          <span>Efectivo contado</span>
          <span>{simbolo} {resumen.monto_real.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Diferencia</span>
        <CajaDiferenciaBadge diferencia={resumen.diferencia} mostrarEtiqueta />
      </div>
    </div>
  );
}
