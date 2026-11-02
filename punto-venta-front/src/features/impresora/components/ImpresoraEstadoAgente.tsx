import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MENSAJE_AGENTE_SIN_CONEXION } from "../hooks/useImprimirTicketHook";

interface ImpresoraEstadoAgenteProps {
  conectado: boolean;
  verificando: boolean;
  onReintentar: () => void;
}

export function ImpresoraEstadoAgente({ conectado, verificando, onReintentar }: ImpresoraEstadoAgenteProps) {
  if (conectado || verificando) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {verificando ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        )}
        <span className="text-muted-foreground">
          Servicio de impresión: <span className="font-medium text-foreground">{verificando ? "verificando..." : "conectado"}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:bg-amber-950/30 dark:text-amber-200">
      <div className="flex items-start gap-2.5">
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{MENSAJE_AGENTE_SIN_CONEXION}</span>
      </div>
      <Button type="button" variant="outline" size="sm" className="shrink-0 gap-2" onClick={onReintentar}>
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </Button>
    </div>
  );
}
