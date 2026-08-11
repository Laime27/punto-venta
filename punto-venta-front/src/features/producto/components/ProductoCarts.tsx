import { useProductoHook } from "../hooks/ProductoHook";
import { Card, CardContent } from "@/components/ui/card";
import type { StatsType } from "../types/ProductoType";

export function ProductoCarts() {
  const { datos } = useProductoHook();
  const stats:StatsType = datos.stats;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      {/* Tarjeta 1: Costo de Inventario */}
      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
            Costo de Inventario
          </p>
          <div className="flex items-baseline">
            <span className="text-xl text-muted-foreground font-medium mr-1">S/</span>
            <span className="text-3xl font-black text-foreground tracking-tight">
              {(stats?.total_costo)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
            <p className="text-sm text-muted-foreground font-medium">Inversión total retenida</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
            Valor en Venta
          </p>
          <div className="flex items-baseline">
            <span className="text-xl text-muted-foreground font-medium mr-1">S/</span>
            <span className="text-3xl font-black text-blue-600 tracking-tight">
              {(stats?.total_venta)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
            <p className="text-sm text-muted-foreground font-medium">Valor de mercado esperado</p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardContent className="p-6">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">
            Utilidad Proyectada
          </p>
          <div className="flex items-baseline">
            <span className="text-xl text-muted-foreground font-medium mr-1">S/</span>
            <span className="text-3xl font-black text-emerald-500 tracking-tight">
              {(stats?.utilidad_proyectada)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <p className="text-sm text-muted-foreground font-medium">Margen neto estimado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
