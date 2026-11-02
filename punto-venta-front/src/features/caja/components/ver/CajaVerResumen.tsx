import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  Calculator,
  CreditCard,
  HandCoins,
  Landmark,
  Undo2,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { CajaResumen } from "../../types/CajaType";

interface Props {
  resumen: CajaResumen;
}

export function CajaVerResumen({ resumen }: Props) {
  const { simbolo } = useMonedaHook();
  const { ventas, movimientos } = resumen;

  const tarjetas = [
    { titulo: "Apertura", monto: resumen.monto_apertura, icono: Wallet, color: "border-l-primary text-primary" },
    { titulo: "Ventas efectivo", monto: ventas.efectivo, icono: Banknote, color: "border-l-emerald-500 text-emerald-500", detalle: `${ventas.cantidad_comprobantes} comprobantes` },
    { titulo: "Ventas tarjeta", monto: ventas.tarjeta, icono: CreditCard, color: "border-l-violet-500 text-violet-500" },
    { titulo: "Transferencias", monto: ventas.transferencia, icono: Landmark, color: "border-l-sky-500 text-sky-500" },
    { titulo: "Cobros crédito", monto: resumen.cobros_credito, icono: HandCoins, color: "border-l-blue-500 text-blue-500", detalle: "Abonos de días anteriores" },
    { titulo: "Ingresos", monto: movimientos.total_ingresos, icono: ArrowUpCircle, color: "border-l-teal-500 text-teal-500", detalle: `${movimientos.cantidad_ingresos} movimientos` },
    { titulo: "Egresos", monto: movimientos.total_egresos, icono: ArrowDownCircle, color: "border-l-destructive text-destructive", detalle: `${movimientos.cantidad_egresos} movimientos` },
    { titulo: "Vuelto entregado", monto: resumen.vuelto_entregado, icono: Undo2, color: "border-l-amber-500 text-amber-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {tarjetas.map(({ titulo, monto, icono: Icono, color, detalle }) => (
          <Card key={titulo} className={`shadow-sm border-l-4 ${color}`}>
            <CardContent className="p-3.5 sm:p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">{titulo}</span>
                <Icono className="h-4 w-4" />
              </div>
              <p className="text-lg sm:text-xl font-black text-foreground">
                {simbolo} {monto.toFixed(2)}
              </p>
              {detalle && <p className="text-xs font-medium text-muted-foreground">{detalle}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <Calculator className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-bold text-foreground">Saldo teórico en efectivo</p>
            <p className="text-xs text-muted-foreground">Apertura + efectivo + ingresos − egresos</p>
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-primary whitespace-nowrap">
          {simbolo} {resumen.saldo_teorico.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
