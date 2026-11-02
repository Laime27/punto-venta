import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { OrdenCompraType } from "../../types/OrdenCompraType";

interface Props {
  ordenCompra: OrdenCompraType;
  totalRealCalculado: number;
}

export function OrdenCompraRecibirInfoGeneral({ ordenCompra, totalRealCalculado }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <Card className="">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Información General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div>
            <Label className="text-muted-foreground block text-xs mb-1">Proveedor</Label>
            <span className="font-medium">{ordenCompra.proveedor?.nombre ?? "Sin proveedor"}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground block text-xs mb-1">Fecha Emisión</Label>
              <span className="font-medium">{ordenCompra.fecha_emision ?? "-"}</span>
            </div>
            <div>
              <Label className="text-muted-foreground block text-xs mb-1">Fecha Recepción</Label>
              <span className="font-medium">{ordenCompra.fecha_recepcion ?? "-"}</span>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground block text-xs mb-1">Documento</Label>
            <span className="font-medium">
              {ordenCompra.serie ? `${ordenCompra.serie}-${ordenCompra.correlativo}` : "Sin documento registrado"}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-1">
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>Total Estimado</span>
            <span>{simbolo} {Number(ordenCompra.total_estimado ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 text-primary">
            <span>Total Real</span>
            <span>{simbolo} {totalRealCalculado.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
