import { Input } from "@/components/ui/input";

import { type useTotals } from "../../hooks/detallecarrito/useTotals";

interface POSTotalsProps {
  totalsHook: ReturnType<typeof useTotals>;
}

export function POSTotals({ totalsHook }: POSTotalsProps) {
  const {
    estado: {
      subtotal,
      descuentoText,
      totalCobrar,
      porPagar,
      vuelto
    },
    acciones: {
      manejarCambioDescuento
    }
  } = totalsHook;
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2 border-b border-muted/50 pb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtotal</span>
          <span className="text-sm font-bold">S/ {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descuento</span>
          <div className="flex items-center gap-1 w-24">
            <span className="text-xs font-medium">S/</span>
            <Input 
              type="text"
              value={descuentoText}
              onChange={(e) => manejarCambioDescuento(e.target.value)}
              className="h-7 text-right text-xs bg-muted/30 border-muted"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total a Cobrar</span>
          <span className="text-sm font-bold text-primary">S/ {totalCobrar.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="text-[10px] text-muted-foreground mb-1 uppercase font-semibold">POR PAGAR</div>
          <div className=" font-bold text-sm">S/ {porPagar.toFixed(2)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground mb-1 uppercase font-semibold">VUELTO</div>
          <div className=" font-bold text-sm">S/ {vuelto.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
