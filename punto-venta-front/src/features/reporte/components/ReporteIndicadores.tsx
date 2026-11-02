import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IndicadorReporte } from "../types/ReporteType";

interface Props {
  indicadores: IndicadorReporte[];
  cargando: boolean;
}

const TONOS: Record<NonNullable<IndicadorReporte["tono"]>, string> = {
  neutro: "text-foreground",
  positivo: "text-emerald-600",
  negativo: "text-red-600",
  alerta: "text-amber-600",
};

export function ReporteIndicadores({ indicadores, cargando }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {indicadores.map(({ titulo, valor, detalle, tono = "neutro" }) => (
        <Card key={titulo}>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">{titulo}</p>
            {cargando ? (
              <Skeleton className="mt-2 h-7 w-24" />
            ) : (
              <p className={cn("mt-1 text-2xl font-bold tabular-nums", TONOS[tono])}>{valor}</p>
            )}
            {detalle && <p className="mt-1 text-xs text-muted-foreground">{detalle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
