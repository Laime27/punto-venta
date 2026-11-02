import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

import { fechaHoy, useCuotas } from "../../hooks/detallecarrito/useCuotas";

export function POSCuotas({ cuotasHook }: { cuotasHook: ReturnType<typeof useCuotas> }) {
  const { cuotas, agregarCuota, eliminarCuota, actualizarCuota } = cuotasHook;
  return (
    <div className="space-y-3 pt-2">
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          CUOTAS DE PAGO
        </div>
        <Button variant="outline" size="sm" onClick={agregarCuota} className="h-7 text-xs border-muted">
          <Plus className="h-3 w-3 mr-1" />
          Agregar Cuota
        </Button>
      </div>

      <div className="space-y-2">
        {cuotas.map((cuota, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input 
              type="date"
              value={cuota.fecha}
              min={fechaHoy()}
              onChange={(e) => actualizarCuota(index, 'fecha', e.target.value)}
              className="h-9 bg-muted/30 border-muted text-sm flex-1"
            />
            <Input 
              type="text"
              placeholder="Monto"
              value={cuota.monto}
              onFocus={(e) => e.target.select()}
              onChange={(e) => actualizarCuota(index, 'monto', e.target.value)}
              className="h-9 bg-muted/30 border-muted text-sm flex-1"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => eliminarCuota(index)}
              className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {cuotas.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md">
            No hay cuotas programadas
          </div>
        )}
      </div>
    </div>
  );
}
