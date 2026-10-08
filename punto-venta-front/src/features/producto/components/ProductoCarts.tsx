import { useProductoHook } from "../hooks/ProductoHook";
import { Card, CardContent } from "@/components/ui/card";
import { Package, DollarSign } from "lucide-react";
import type { StatsType } from "../types/ProductoType";
import { formatearMoneda } from "@/lib/utils";
import { SIMBOLO_MONEDA } from "@/lib/constants";

export function ProductoCarts() {
  const { datos } = useProductoHook();
  const stats: StatsType = datos.stats;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              Costo de Inventario
            </p>
            <div className="rounded-md bg-muted p-1">
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl text-muted-foreground mr-1">{SIMBOLO_MONEDA}</span>
            <span className="text-3xl text-foreground tracking-tight">
              {formatearMoneda(stats?.total_costo)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-slate-400"></div>
            <p className="text-sm text-muted-foreground">Inversión total retenida en stock</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              Valor en Venta
            </p>
            <div className="rounded-md bg-muted p-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl text-muted-foreground mr-1">{SIMBOLO_MONEDA}</span>
            <span className="text-3xl text-foreground tracking-tight">
              {formatearMoneda(stats?.total_venta)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-slate-400"></div>
            <p className="text-sm text-muted-foreground">Valor estimado de recuperación</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              Margen & Utilidad
            </p>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl text-muted-foreground mr-1">{SIMBOLO_MONEDA}</span>
            <span className="text-3xl text-foreground tracking-tight">
              {formatearMoneda(stats?.utilidad_proyectada)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <p className="text-sm text-muted-foreground">Margen bruto proyectado acumulado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
