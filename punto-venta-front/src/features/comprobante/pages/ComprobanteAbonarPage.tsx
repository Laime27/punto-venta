import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useComprobanteAbonar } from "../hooks/useComprobanteAbonar";
import { ComprobanteAbonarCuotas } from "../components/abonar/ComprobanteAbonarCuotas";
import { ComprobanteAbonarMetodosPago } from "../components/abonar/ComprobanteAbonarMetodosPago";
import { ComprobanteAbonarResumen } from "../components/abonar/ComprobanteAbonarResumen";
import { ComprobanteAbonarHistorialPagos } from "../components/abonar/ComprobanteAbonarHistorialPagos";
import { ComprobanteEstadoBadge } from "../components/ComprobanteEstadoBadge";

export function ComprobanteAbonarPage() {
  const {
    estado: {
      comprobante,
      cuotas,
      cuotaSeleccionada,
      metodosPago,
      metodoSeleccionado,
      monto,
      pagosAgregados,
      estaCargando,
      estaEnviando,
      errorComprobante,
      saldoPendienteCuota,
      totalAbonado,
      saldoRestante,
      saldoTotalComprobante,
      puedeAgregarPago,
      puedeRegistrarAbono,
    },
    funciones: {
      volver,
      seleccionarCuota,
      seleccionarMetodo,
      cambiarMonto,
      agregarPago,
      eliminarPago,
      registrarAbono,
    },
  } = useComprobanteAbonar();

  if (estaCargando) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[350px] gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground">
          Cargando información del comprobante y métodos de pago...
        </p>
      </div>
    );
  }

  if (errorComprobante || !comprobante) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[350px] gap-4">
        <p className="text-base font-semibold text-muted-foreground">
          No se encontró el comprobante solicitado.
        </p>
        <Button variant="outline" onClick={volver} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver a Comprobantes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={volver}
            className="h-9 w-9 shrink-0"
            title="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Abonar Deuda: {comprobante.serie}-{comprobante.correlativo}
              </h1>
              <Badge variant="outline" className="text-xs font-bold uppercase bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300">
                <CreditCard className="h-3 w-3 mr-1" />
                {comprobante.forma_pago || "Crédito"}
              </Badge>
              <ComprobanteEstadoBadge estado={comprobante.estado} />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Registra pagos parciales o totales sobre las cuotas pendientes del cliente.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ComprobanteAbonarCuotas
            cuotas={cuotas}
            cuotaSeleccionada={cuotaSeleccionada}
            onSeleccionarCuota={seleccionarCuota}
          />

          <ComprobanteAbonarMetodosPago
            metodosPago={metodosPago}
            metodoSeleccionado={metodoSeleccionado}
            monto={monto}
            pagosAgregados={pagosAgregados}
            saldoRestante={saldoRestante}
            puedeAgregarPago={puedeAgregarPago}
            onSeleccionarMetodo={seleccionarMetodo}
            onCambiarMonto={cambiarMonto}
            onAgregarPago={agregarPago}
            onEliminarPago={eliminarPago}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <ComprobanteAbonarResumen
            comprobante={comprobante}
            cuotaSeleccionada={cuotaSeleccionada}
            saldoPendienteCuota={saldoPendienteCuota}
            totalAbonado={totalAbonado}
            saldoRestante={saldoRestante}
            saldoTotalComprobante={saldoTotalComprobante}
            estaEnviando={estaEnviando}
            puedeRegistrarAbono={puedeRegistrarAbono}
            onRegistrarAbono={registrarAbono}
            onVolver={volver}
          />

          <ComprobanteAbonarHistorialPagos
            pagos={comprobante.pagos || []}
          />
        </div>
      </div>
    </div>
  );
}
