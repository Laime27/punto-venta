import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { CotizacionType } from "../../types/CotizacionType";

interface Props {
  cotizacion: CotizacionType;
}

export function CotizacionVerInformacionGeneral({ cotizacion }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Información General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div>
            <Label className="text-muted-foreground block text-xs mb-1">Cliente</Label>
            <span className="font-medium">{cotizacion.cliente ? `${cotizacion.cliente.nombre}` : "Sin cliente"}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground block text-xs mb-1">Fecha Emisión</Label>
              <span className="font-medium">{cotizacion.fecha_emision ? cotizacion.fecha_emision.split("T")[0] : "-"}</span>
            </div>
            <div>
              <Label className="text-muted-foreground block text-xs mb-1">Fecha Venc.</Label>
              <span className="font-medium">{cotizacion.fecha_vencimiento ? cotizacion.fecha_vencimiento.split("T")[0] : "-"}</span>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground block text-xs mb-1">Documento</Label>
            <span className="font-medium">
              {cotizacion.serie ? `${cotizacion.serie}-${cotizacion.correlativo}` : "Sin documento"}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-1">
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>Subtotal</span>
            <span>{simbolo} {Number(cotizacion.subtotal ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>Descuento Global</span>
            <span>{simbolo} {Number(cotizacion.descuento ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 text-primary">
            <span>Total</span>
            <span>{simbolo} {Number(cotizacion.total ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
