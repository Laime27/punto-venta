import { Card } from "@/components/ui/card";
import { POSProductSearch } from "../buscadores/POSProductSearch";
import { POSCustomerSearch } from "../buscadores/POSCustomerSearch";
import { POSCartList } from "./POSCartList";
import { usePosContext } from "../../context/PosContext";

export function POSCartTable() {
  const { estado: { total } } = usePosContext();

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      
      <POSCustomerSearch />

      <div className="flex">
        <POSProductSearch />
      </div>

      <Card className="flex flex-col flex-1 overflow-hidden border-border rounded-2xl shadow-sm">
        <div className="grid grid-cols-12 gap-2 p-3 border-b bg-muted/10 text-[11px] font-bold text-muted-foreground uppercase">
          <div className="col-span-1 text-center"></div>
          <div className="col-span-5">PRODUCTO</div>
          <div className="col-span-2 text-center">P. UNIT.</div>
          <div className="col-span-2 text-center">CANTIDAD</div>
          <div className="col-span-2 text-right pr-4">TOTAL</div>
        </div>

        <POSCartList />

        <div className="p-3 border-t flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
           
          </div>
          <div className="flex items-end gap-2 pr-4">
            <span className="text-sm text-muted-foreground mb-0.5">Sub total</span>
            <span className="text-2xl font-black ">S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
