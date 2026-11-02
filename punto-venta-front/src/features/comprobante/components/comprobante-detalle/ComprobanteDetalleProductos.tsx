import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { ComprobanteDetalleType } from "../../types/ComprobanteType";

interface Props {
  detalles?: ComprobanteDetalleType[];
}

export function ComprobanteDetalleProductos({ detalles }: Props) {
  const { simbolo } = useMonedaHook();
  const tieneProductos = detalles && detalles.length > 0;

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="p-3.5 sm:p-4 border-b bg-card flex items-center justify-between">
        <span className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
          <ShoppingBag className="h-4 w-4 text-primary" /> Productos Vendidos
        </span>
        {tieneProductos && (
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {detalles.length} {detalles.length === 1 ? "ítem" : "ítems"}
          </span>
        )}
      </div>

      {!tieneProductos ? (
        <div className="p-4 text-center text-sm font-medium text-foreground">
          No hay productos registrados en este comprobante
        </div>
      ) : (
        <>
          <div className="divide-y sm:hidden max-h-64 overflow-y-auto">
            {detalles.map((detalle) => {
              const unidadAbrev = detalle.producto?.unidad?.abreviatura || "";
              return (
                <div key={detalle.id} className="p-3 space-y-1 bg-card">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-sm text-foreground leading-snug">
                      {detalle.producto?.nombre || "Producto"}
                    </p>
                    <span className="font-extrabold text-sm text-primary shrink-0">
                      {simbolo} {Number(detalle.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center text-xs text-muted-foreground gap-1 pt-0.5">
                    <span className="font-medium text-foreground">
                      {detalle.cantidad} {unidadAbrev} × {simbolo} {Number(detalle.precio_unitario).toFixed(2)}
                    </span>
                    {detalle.producto?.codigo_barras && (
                      <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded text-foreground/80">
                        Cód: {detalle.producto.codigo_barras}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <div className="min-w-[480px]">
              <div className="grid grid-cols-[1fr_90px_110px_110px] gap-2 px-4 py-3 bg-muted text-sm font-bold text-foreground border-b">
                <div>PRODUCTO</div>
                <div className="text-center">CANT.</div>
                <div className="text-right">PRECIO UNIT.</div>
                <div className="text-right">SUBTOTAL</div>
              </div>

              <div className="divide-y max-h-64 overflow-y-auto">
                {detalles.map((detalle) => {
                  const unidadAbrev = detalle.producto?.unidad?.abreviatura || "";
                  return (
                    <div
                      key={detalle.id}
                      className="grid grid-cols-[1fr_90px_110px_110px] gap-2 px-4 py-3 items-center"
                    >
                      <div>
                        <p className="font-semibold text-sm text-foreground truncate">
                          {detalle.producto?.nombre || "Producto"}
                        </p>
                        {detalle.producto?.codigo_barras && (
                          <p className="text-xs font-medium text-foreground/80">
                            Cód: {detalle.producto.codigo_barras}
                          </p>
                        )}
                      </div>
                      <div className="text-center">
                        <span className="font-bold text-sm text-foreground">
                          {detalle.cantidad}
                        </span>
                        {unidadAbrev && (
                          <span className="text-xs font-semibold text-foreground/80 ml-1">
                            {unidadAbrev}
                          </span>
                        )}
                      </div>
                      <div className="text-right text-sm font-semibold text-foreground">
                        {simbolo} {Number(detalle.precio_unitario).toFixed(2)}
                      </div>
                      <div className="text-right text-sm font-bold text-foreground">
                        {simbolo} {Number(detalle.subtotal).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
