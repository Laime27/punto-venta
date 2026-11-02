import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  titulo: string;
  descripcion?: string;
  cargando: boolean;
  vacio: boolean;
  className?: string;
  children: ReactNode;
}

export function ReporteGraficoCard({ titulo, descripcion, cargando, vacio, className, children }: Props) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{titulo}</CardTitle>
        {descripcion && <p className="text-xs text-muted-foreground">{descripcion}</p>}
      </CardHeader>
      <CardContent className="flex-1">
        {cargando ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : vacio ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Sin datos en el periodo.</div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
