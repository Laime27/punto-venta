import { Button } from "@/components/ui/button"
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook"
import { Input } from "@/components/ui/input"
import { type MetodoPagoType } from "@/features/metodopago/types/MetodopagoType"
import { X } from "lucide-react"
import { type useMetodosPago } from "../../hooks/detallecarrito/useMetodosPago"

interface POSMetodosPagoProps {
  metodosPago: MetodoPagoType[]
  paymentMethodsHook: ReturnType<typeof useMetodosPago>
  porPagar?: number
  titulo?: string
}

export function POSMetodosPago({
  metodosPago,
  paymentMethodsHook,
  porPagar = 0,
  titulo = "MÉTODO DE PAGO",
}: POSMetodosPagoProps) {
  const { simbolo } = useMonedaHook()
  const {
    estado: { metodoSeleccionado, monto, pagosAgregados, puedeAgregarPago },
    acciones: {
      seleccionarMetodo,
      manejarCambioMonto,
      agregarPago,
      eliminarPago,
      manejarKeyDown,
    },
    refs: { inputRef },
  } = paymentMethodsHook

  return (
    <div className="space-y-3 pt-2">
      <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        {titulo}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {metodosPago && metodosPago.length > 0 ? (
          metodosPago.map((metodo, index) => {
            const esSeleccionado = metodoSeleccionado?.id === metodo.id

            return (
              <Button
                key={metodo.id || index}
                variant={esSeleccionado ? "default" : "outline"}
                className={
                  esSeleccionado
                    ? "h-9 text-xs font-medium"
                    : "h-9 border-muted text-xs font-medium text-muted-foreground hover:bg-muted/30"
                }
                onClick={() => seleccionarMetodo(metodo, porPagar)}
              >
                {metodo.nombre || " "}
              </Button>
            )
          })
        ) : (
          <div className="col-span-3 py-2 text-center text-xs text-muted-foreground">
            No hay métodos de pago disponibles
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Monto"
          value={monto}
          onFocus={(e)=>e.target.select()}
          onChange={(e) => manejarCambioMonto(e.target.value)}
          onKeyDown={manejarKeyDown}
          disabled={!metodoSeleccionado}
          className="h-10 border-muted bg-muted/30 font-medium text-foreground disabled:opacity-50"
        />
        <Button
          onClick={agregarPago}
          disabled={!puedeAgregarPago}
          className="h-10 bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          + Agregar
        </Button>
      </div>

      {pagosAgregados.length > 0 && (
        <div className="space-y-2 pt-2">
          {pagosAgregados.map((pago) => (
            <div
              key={pago.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background shadow-sm px-3 py-2"
            >
              <span className="text-sm font-medium text-foreground">
                {pago.metodo.nombre}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-foreground">
                  {simbolo} {pago.monto.toFixed(2)}
                </span>
                <button
                  onClick={() => eliminarPago(pago.id)}
                  className="flex items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
