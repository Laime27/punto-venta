import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Wallet,
  CreditCard,
  AlertCircle,
  Ban,
} from "lucide-react";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { ComprobanteMetricasType } from "../types/ComprobanteType";

interface Props {
  metricas?: ComprobanteMetricasType;
  isLoading?: boolean;
}

export function ComprobanteMetricasCards({ metricas, isLoading }: Props) {
  const { simbolo } = useMonedaHook();
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse shadow-sm">
            <CardContent className="p-4 sm:p-4.5 space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-6 w-28 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalVentas = Number(metricas?.total_ventas || 0).toFixed(2);
  const totalContado = Number(metricas?.total_contado || 0).toFixed(2);
  const totalCredito = Number(metricas?.total_credito || 0).toFixed(2);
  const totalPendiente = Number(metricas?.total_pendiente_cobro || 0).toFixed(2);
  const montoAnulado = Number(metricas?.monto_anulado || 0).toFixed(2);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      <Card className="shadow-sm border-l-4 border-l-primary">
        <CardContent className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ventas</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-foreground">
            {simbolo} {totalVentas}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {metricas?.total_comprobantes || 0} comprobantes
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-emerald-500">
        <CardContent className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Contado</span>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-foreground">
            {simbolo} {totalContado}
          </p>
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Cobrado en venta
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Crédito</span>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-foreground">
            {simbolo} {totalCredito}
          </p>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
            Ventas a plazos
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-amber-500">
        <CardContent className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Por Cobrar</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-amber-700 dark:text-amber-400">
            {simbolo} {totalPendiente}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            Cuotas pendientes
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-l-4 border-l-destructive col-span-2 sm:col-span-1">
        <CardContent className="p-3.5 sm:p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Anulados</span>
            <Ban className="h-4 w-4 text-destructive" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-destructive">
            {simbolo} {montoAnulado}
          </p>
          <p className="text-xs font-medium text-muted-foreground">
            {metricas?.total_anulados || 0} anulados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
