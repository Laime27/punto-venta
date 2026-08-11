import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { POSPaymentMethods } from "./POSPaymentMethods";
import { POSInstallments } from "./POSInstallments";
import { POSTotals } from "./POSTotals";
import { usePOSSummary } from "../../hooks/detallecarrito/usePOSSummary";

export function POSSummary() {
  const {
    estado: { tipoVenta, listaMetodoPago },
    modificadores: { setTipoVenta },
    hooks: { cuotasHook, paymentMethodsHook, totalsHook },
    funciones: { completarVenta },
  } = usePOSSummary();

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border rounded-2xl shadow-sm">
      
      <div className="p-4 border-b">
        <div className="flex bg-muted/50 rounded-xl p-1 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTipoVenta("contado")}
            className={`flex-1 h-8 text-xs font-semibold rounded-lg ${tipoVenta === 'contado' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Contado
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTipoVenta("credito")}
            className={`flex-1 h-8 text-xs font-semibold rounded-lg ${tipoVenta === 'credito' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Crédito
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <POSTotals totalsHook={totalsHook} />

        {tipoVenta === 'contado' ? (
          <POSPaymentMethods 
            metodosPago={listaMetodoPago} 
            paymentMethodsHook={paymentMethodsHook}
            porPagar={totalsHook.estado.porPagar}
          />
        ) : (
          <POSInstallments cuotasHook={cuotasHook} />
        )}

      </div>

      <div className="p-4 border-t">
        <Button 
          onClick={completarVenta}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center justify-center gap-2 rounded-xl"
        >
          <Check className="h-4 w-4" />
          Completar Venta
        </Button>
      </div>
    </Card>
  )
}
