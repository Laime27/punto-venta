import { ArrowDownToLine, ArrowUpFromLine, Package, Scale, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { KardexResumenType } from "../types/KardexType";

interface Props {
  resumen: KardexResumenType;
  abreviatura?: string;
}

interface Indicador {
  titulo: string;
  valor: string;
  icono: LucideIcon;
  color: string;
}

export function KardexResumen({ resumen, abreviatura = "" }: Props) {
  const { formatearMonto } = useMonedaHook();
  const unidades = (valor: number) => `${Number(valor.toFixed(2))} ${abreviatura}`.trim();

  const indicadores: Indicador[] = [
    { titulo: "Saldo inicial", valor: unidades(resumen.saldo_inicial), icono: Package, color: "text-slate-600" },
    { titulo: "Entradas", valor: `+${unidades(resumen.entradas)}`, icono: ArrowDownToLine, color: "text-emerald-600" },
    { titulo: "Salidas", valor: `-${unidades(resumen.salidas)}`, icono: ArrowUpFromLine, color: "text-red-600" },
    { titulo: "Saldo final", valor: unidades(resumen.saldo_final), icono: Scale, color: "text-blue-600" },
    ...(resumen.valor_stock !== null
      ? [{ titulo: "Valor del stock actual", valor: formatearMonto(resumen.valor_stock), icono: Wallet, color: "text-amber-600" }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {indicadores.map(({ titulo, valor, icono: Icono, color }) => (
        <Card key={titulo}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{titulo}</p>
              <Icono className={`h-4 w-4 ${color}`} />
            </div>
            <p className={`mt-2 text-xl font-bold ${color}`}>{valor}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
