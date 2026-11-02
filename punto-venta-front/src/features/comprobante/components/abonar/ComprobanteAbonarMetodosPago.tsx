import { CreditCard, Plus, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { MetodoPagoType } from "@/features/metodopago/types/MetodopagoType";
import type { PagoAgregadoAbono } from "../../hooks/useComprobanteAbonar";

interface Props {
  metodosPago: MetodoPagoType[];
  metodoSeleccionado: MetodoPagoType | null;
  monto: string;
  pagosAgregados: PagoAgregadoAbono[];
  saldoRestante: number;
  puedeAgregarPago: boolean;
  onSeleccionarMetodo: (metodo: MetodoPagoType) => void;
  onCambiarMonto: (monto: string) => void;
  onAgregarPago: () => void;
  onEliminarPago: (id: string) => void;
}

export function ComprobanteAbonarMetodosPago({
  metodosPago,
  metodoSeleccionado,
  monto,
  pagosAgregados,
  saldoRestante,
  puedeAgregarPago,
  onSeleccionarMetodo,
  onCambiarMonto,
  onAgregarPago,
  onEliminarPago,
}: Props) {
  const { simbolo } = useMonedaHook();
  const manejarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && puedeAgregarPago) {
      e.preventDefault();
      onAgregarPago();
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 sm:p-5 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Métodos de Pago
          </CardTitle>
          <span className="text-xs font-semibold text-muted-foreground">
            Saldo pendiente:{" "}
            <strong className="text-foreground">
              {simbolo} {saldoRestante.toFixed(2)}
            </strong>
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            1. Seleccionar Método de Pago
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {metodosPago.map((metodo) => {
              const esActivo = metodoSeleccionado?.id === metodo.id;
              return (
                <Button
                  key={metodo.id}
                  type="button"
                  variant={esActivo ? "default" : "outline"}
                  onClick={() => onSeleccionarMetodo(metodo)}
                  className={`h-11 font-bold text-xs justify-center transition-all ${
                    esActivo
                      ? "shadow-sm ring-2 ring-primary/30"
                      : "hover:bg-muted/60 hover:border-primary/40 text-foreground"
                  }`}
                >
                  {metodo.nombre}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            2. Ingresar Monto del Abono
          </Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                {simbolo}
              </span>
              <Input
                type="text"
                value={monto}
                onChange={(e) => onCambiarMonto(e.target.value)}
                onKeyDown={manejarKeyDown}
                placeholder="0.00"
                className="pl-9 h-11 text-base font-bold text-foreground"
                disabled={!metodoSeleccionado || saldoRestante <= 0}
              />
            </div>

            <Button
              type="button"
              onClick={onAgregarPago}
              disabled={!puedeAgregarPago}
              className="h-11 px-5 font-bold gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Agregar Pago
            </Button>
          </div>
          {metodoSeleccionado && (
            <p className="text-xs text-muted-foreground">
              Método seleccionado:{" "}
              <strong className="text-foreground">{metodoSeleccionado.nombre}</strong>
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pagos a Realizar ({pagosAgregados.length})
            </Label>
          </div>

          {pagosAgregados.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              No se han agregado métodos de pago para este abono.
            </div>
          ) : (
            <div className="space-y-2">
              {pagosAgregados.map((pago) => (
                <div
                  key={pago.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                      {pago.metodo_nombre}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-foreground">
                      {simbolo} {pago.monto.toFixed(2)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEliminarPago(pago.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Eliminar este pago"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
