import { ArrowDownToLine, ArrowUpFromLine, Flag, Package, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { FiltrosKardexType, KardexResumenType } from "../types/KardexType";

interface Props {
  resumen: KardexResumenType;
  filtros: FiltrosKardexType;
  abreviatura?: string;
}

interface Indicador {
  titulo: string;
  valor: string;
  detalle: string;
  icono: LucideIcon;
  colorIcono: string;
  colorValor?: string;
}

const formatearFecha = (fecha: string) => fecha.split("-").reverse().join("/");

export function KardexResumen({ resumen, filtros, abreviatura = "" }: Props) {
  const { formatearMonto } = useMonedaHook();
  const unidades = (valor: number) => `${Number(valor.toFixed(2))} ${abreviatura}`.trim();

  const indicadores: Indicador[] = [
    {
      titulo: "Stock al inicio",
      valor: unidades(resumen.saldo_inicial),
      detalle: filtros.fecha_inicio ? `Antes del ${formatearFecha(filtros.fecha_inicio)}` : "Antes del primer movimiento",
      icono: Package,
      colorIcono: "bg-muted text-muted-foreground",
    },
    {
      titulo: "Entradas",
      valor: resumen.entradas > 0 ? `+${unidades(resumen.entradas)}` : unidades(0),
      detalle: "Compras, ajustes y anulaciones",
      icono: ArrowDownToLine,
      colorIcono: "bg-emerald-500/10 text-emerald-600",
      colorValor: resumen.entradas > 0 ? "text-emerald-600" : undefined,
    },
    {
      titulo: "Salidas",
      valor: resumen.salidas > 0 ? `-${unidades(resumen.salidas)}` : unidades(0),
      detalle: "Ventas, pérdidas y ajustes",
      icono: ArrowUpFromLine,
      colorIcono: "bg-red-500/10 text-red-600",
      colorValor: resumen.salidas > 0 ? "text-red-600" : undefined,
    },
    {
      titulo: "Stock final",
      valor: unidades(resumen.saldo_final),
      detalle: filtros.fecha_fin ? `Al ${formatearFecha(filtros.fecha_fin)}` : "Después de todos los movimientos",
      icono: Flag,
      colorIcono: "bg-blue-500/10 text-blue-600",
    },
    ...(resumen.valor_stock !== null
      ? [{
          titulo: "Valor del stock",
          valor: formatearMonto(resumen.valor_stock),
          detalle: "Stock actual a precio de costo",
          icono: Wallet,
          colorIcono: "bg-amber-500/10 text-amber-600",
        }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:auto-cols-fr lg:grid-flow-col">
      {indicadores.map(({ titulo, valor, detalle, icono: Icono, colorIcono, colorValor }) => (
        <Card key={titulo}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorIcono}`}>
                <Icono className="h-4 w-4" />
              </span>
            </div>
            <p className={`mt-1 text-2xl font-bold ${colorValor ?? "text-foreground"}`}>{valor}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detalle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
