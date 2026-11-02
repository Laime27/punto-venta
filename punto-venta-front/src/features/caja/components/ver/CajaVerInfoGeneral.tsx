import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { CajaDiferenciaBadge } from "../general/CajaDiferenciaBadge";
import type { CajaDetalle, CajaResumen } from "../../types/CajaType";

interface Props {
  caja: CajaDetalle;
  resumen: CajaResumen;
}

export function CajaVerInfoGeneral({ caja, resumen }: Props) {
  const { simbolo } = useMonedaHook();
  const filas = [
    { etiqueta: "Abierto por", valor: caja.abierto_por?.name ?? "-" },
    { etiqueta: "Fecha apertura", valor: caja.fecha_apertura },
    { etiqueta: "Cerrado por", valor: caja.cerrado_por?.name ?? "-" },
    { etiqueta: "Fecha cierre", valor: caja.fecha_cierre ?? "-" },
    { etiqueta: "Monto real", valor: caja.monto_real !== null ? `${simbolo} ${Number(caja.monto_real).toFixed(2)}` : "-" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Información general</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 text-sm">
          {filas.map((fila) => (
            <div key={fila.etiqueta} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{fila.etiqueta}</span>
              <span className="text-right font-semibold">{fila.valor}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Diferencia</span>
            <CajaDiferenciaBadge diferencia={caja.diferencia} mostrarEtiqueta />
          </div>
          {caja.observaciones && (
            <div className="border-t pt-2.5">
              <p className="text-muted-foreground">Observaciones</p>
              <p className="whitespace-pre-line">{caja.observaciones}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Ventas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total ({resumen.ventas.cantidad_comprobantes} comprobantes)</span>
            <span className="font-bold">{simbolo} {resumen.ventas.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contado</span>
            <span className="font-semibold">{simbolo} {resumen.ventas.contado.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Crédito</span>
            <span className="font-semibold">{simbolo} {resumen.ventas.credito.toFixed(2)}</span>
          </div>

          <p className="pt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Desglose por método de pago
          </p>
          {resumen.ventas.desglose_metodos.length === 0 ? (
            <p className="text-muted-foreground">Sin pagos registrados</p>
          ) : (
            resumen.ventas.desglose_metodos.map((metodo) => (
              <div key={metodo.metodo_pago_id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {metodo.nombre} ({metodo.tipo})
                </span>
                <span className="font-semibold">{simbolo} {metodo.total.toFixed(2)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
