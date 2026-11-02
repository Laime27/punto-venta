import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { CajaResumen } from "../../types/CajaType";

interface Props {
  resumen: CajaResumen;
}

export function CerrarCajaArqueo({ resumen }: Props) {
  const { simbolo } = useMonedaHook();
  const lineas = [
    { etiqueta: "Monto de apertura", monto: resumen.monto_apertura },
    { etiqueta: "+ Ventas en efectivo (neto de vuelto)", monto: resumen.ventas.efectivo },
    { etiqueta: "+ Ingresos", monto: resumen.movimientos.total_ingresos },
    { etiqueta: "− Egresos", monto: resumen.movimientos.total_egresos },
  ];

  return (
    <div className="space-y-2 rounded-lg border bg-muted/30 p-3.5 text-sm">
      {lineas.map((linea) => (
        <div key={linea.etiqueta} className="flex justify-between text-muted-foreground">
          <span>{linea.etiqueta}</span>
          <span className="font-semibold text-foreground">
            {simbolo} {linea.monto.toFixed(2)}
          </span>
        </div>
      ))}
      <div className="flex justify-between border-t pt-2 text-base font-black">
        <span>Saldo teórico</span>
        <span className="text-primary">
          {simbolo} {resumen.saldo_teorico.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
