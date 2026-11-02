import { Card } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { POSBuscadorProducto } from "../buscadores/POSBuscadorProducto";
import { POSBuscadorCliente } from "../buscadores/POSBuscadorCliente";
import { POSCarritoLista } from "./POSCarritoLista";
import { usePosContextoo } from "../../context/PosContexto";

export function POSCarritoTabla() {
  const { simbolo } = useMonedaHook();
  const { estado: { total } } = usePosContextoo();

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      
      <POSBuscadorCliente />

      <div className="flex">
        <POSBuscadorProducto />
      </div>

      <Card className="flex flex-col flex-1 overflow-hidden border-border rounded-2xl shadow-sm">
        <div className="grid grid-cols-12 gap-2 p-3 border-b bg-table-header text-table-header-foreground text-[11px] font-bold uppercase">
          <div className="col-span-5">PRODUCTO</div>
          <div className="col-span-2 text-center">P. UNIT.</div>
          <div className="col-span-2 text-center">CANTIDAD</div>
          <div className="col-span-2 text-right pr-4">TOTAL</div>
          <div className="col-span-1 text-center"></div>
        </div>

        <POSCarritoLista />

        <div className="p-3 border-t flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
           
          </div>
          <div className="flex items-end gap-2 pr-4">
            <span className="text-sm text-muted-foreground mb-0.5">Sub total</span>
            <span className="text-2xl font-black ">{simbolo} {total.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
