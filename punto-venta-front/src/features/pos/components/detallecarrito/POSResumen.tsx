import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, FileText, Loader2, X } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { POSMetodosPago } from "./POSMetodosPago";
import { POSCuotas } from "./POSCuotas";
import { POSTotales } from "./POSTotales";
import { usePOSResumen } from "../../hooks/detallecarrito/usePOSResumen";

export function POSResumen() {
  const {
    estado: { tipoVenta, listaMetodoPago, estaCargandoVenta, cajaActiva, hayVentaEnCurso, confirmarCancelarAbierto, cotizacionOrigen },
    modificadores: { setTipoVenta, abrirConfirmarCancelar, cerrarConfirmarCancelar },
    hooks: { cuotasHook, paymentMethodsHook, adelantoMethodsHook, totalsHook },
    funciones: { completarVenta, cancelarVenta },
  } = usePOSResumen();

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
        {cotizacionOrigen && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <FileText className="h-4 w-4 shrink-0" />
            Venta desde la cotización {cotizacionOrigen.serie}-{cotizacionOrigen.correlativo}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <POSTotales totalsHook={totalsHook} />

        {tipoVenta === 'contado' ? (
          <POSMetodosPago 
            metodosPago={listaMetodoPago} 
            paymentMethodsHook={paymentMethodsHook}
            porPagar={totalsHook.estado.porPagar}
          />
        ) : (
          <>
            <POSMetodosPago 
              metodosPago={listaMetodoPago} 
              paymentMethodsHook={adelantoMethodsHook}
              porPagar={totalsHook.estado.porPagar}
              titulo="ADELANTO (OPCIONAL)"
            />
            <POSCuotas cuotasHook={cuotasHook} />
          </>
        )}

      </div>

      <div className="p-4 border-t flex gap-2">
        <Button
          variant="outline"
          onClick={abrirConfirmarCancelar}
          disabled={estaCargandoVenta || !hayVentaEnCurso}
          className="h-12 px-4 font-bold flex items-center justify-center gap-2 rounded-xl"
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
        <Button
          onClick={completarVenta}
          disabled={estaCargandoVenta || !cajaActiva}
          title={cajaActiva ? undefined : "Debe abrir una caja antes de registrar ventas"}
          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center justify-center gap-2 rounded-xl"
        >
          {estaCargandoVenta ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {estaCargandoVenta ? "Completando..." : "Completar Venta"}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmarCancelarAbierto}
        onClose={cerrarConfirmarCancelar}
        onConfirm={cancelarVenta}
        title="¿Cancelar la venta actual?"
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
      />
    </Card>
  )
}
