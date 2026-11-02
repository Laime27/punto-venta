import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { CotizacionDetalleType } from "../../types/CotizacionType";

interface Props {
  detalles: CotizacionDetalleType[];
}

export function CotizacionVerDetalles({ detalles }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_100px_100px_100px] gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b">
            <div>Producto</div>
            <div className="text-center">Cant.</div>
            <div className="text-center">Precio U.</div>
            <div className="text-center">Desc. U.</div>
            <div className="text-right">Subtotal</div>
          </div>
          <div className="divide-y">
            {detalles.map((d) => (
              <div key={d.id} className="grid grid-cols-[1fr_80px_100px_100px_100px] gap-2 px-4 py-3 items-center text-sm">
                <div className="font-medium truncate">{d.producto?.nombre}</div>
                <div className="text-center">{d.cantidad}</div>
                <div className="text-center">{simbolo} {Number(d.precio_unitario).toFixed(2)}</div>
                <div className="text-center">{simbolo} {Number(d.descuento_unitario ?? 0).toFixed(2)}</div>
                <div className="text-right font-medium">{simbolo} {Number(d.subtotal ?? 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
