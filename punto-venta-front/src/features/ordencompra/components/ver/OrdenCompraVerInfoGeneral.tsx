import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { OrdenCompraType } from "../../types/OrdenCompraType";

interface Props {
  ordenCompra: OrdenCompraType;
}

export function OrdenCompraVerInfoGeneral({ ordenCompra }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <div className="space-y-6">
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
          <div className="flex justify-between font-semibold text-base pt-2">
            <span>Total Real</span>
            <span>{simbolo} {Number(ordenCompra.total_real ?? 0).toFixed(2)}</span>
          </div>
        </div>
        </CardContent>
      </Card>

      {ordenCompra.estado === "RECIBIDA_COMPLETA" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-green-900">Orden Completada</h3>
            <p className="text-xs text-green-700 mt-1">Todos los productos han sido recibidos satisfactoriamente y el inventario ha sido actualizado.</p>
          </div>
        </div>
      )}
    </div>
  );
}
