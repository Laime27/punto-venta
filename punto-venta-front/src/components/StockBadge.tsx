import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { calcularEstadoStock, type EstadoStock } from "@/lib/stock";

const ESTADOS: Record<EstadoStock, { nombre: string; badge: string; punto: string }> = {
  bajo: {
    nombre: "Stock bajo",
    badge: "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    punto: "bg-red-500",
  },
  por_agotarse: {
    nombre: "Por agotarse",
    badge: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    punto: "bg-amber-500",
  },
  normal: {
    nombre: "Normal",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    punto: "bg-emerald-500",
  },
};

interface StockBadgeProps {
  stock: number | string;
  stockMinimo: number | string;
}

export function StockBadge({ stock, stockMinimo }: StockBadgeProps) {
  const cantidad = Number(stock);
  const estado = ESTADOS[calcularEstadoStock(cantidad, Number(stockMinimo))];

  return (
    <Badge variant="outline" className={cn("tabular-nums", estado.badge)} title={estado.nombre}>
      {Number(cantidad.toFixed(2)).toLocaleString("en-US")}
    </Badge>
  );
}

export function StockLeyenda() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      {Object.entries(ESTADOS).map(([clave, { nombre, punto }]) => (
        <span key={clave} className="flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-full", punto)} />
          {nombre}
        </span>
      ))}
    </div>
  );
}
