import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { AjusteInventarioType } from "../../types/AjusteInventarioType";

interface Props {
  ajuste: AjusteInventarioType;
  totalProductos: number;
  valorPerdido: number;
}

export function AjusteInventarioVerInfoGeneral({ ajuste, totalProductos, valorPerdido }: Props) {
  const { simbolo } = useMonedaHook();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Información General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div>
            <Label className="text-muted-foreground block text-xs mb-1">Documento</Label>
            <span className="font-medium">{ajuste.serie}-{ajuste.correlativo}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-muted-foreground block text-xs mb-1">Fecha</Label>
              <span className="font-medium">{ajuste.fecha_emision}</span>
            </div>
            <div>
              <Label className="text-muted-foreground block text-xs mb-1">Registrado por</Label>
              <span className="font-medium">{ajuste.user?.name ?? "-"}</span>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground block text-xs mb-1">Motivo</Label>
            <span className="font-medium whitespace-pre-line">{ajuste.motivo || "Sin motivo registrado"}</span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-1">
          <div className="flex justify-between text-muted-foreground text-sm">
            <span>Productos</span>
            <span>{totalProductos}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2">
            <span>Valor perdido (costo)</span>
            <span>{simbolo} {valorPerdido.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
