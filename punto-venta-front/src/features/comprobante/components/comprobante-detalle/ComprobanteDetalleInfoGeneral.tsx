import { User, Store, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ComprobanteType } from "../../types/ComprobanteType";

interface Props {
  comprobante: ComprobanteType;
}

export function ComprobanteDetalleInfoGeneral({ comprobante }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-3.5 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-4 w-4" /> Cliente
            </span>
            <p className="font-bold text-base text-foreground">
              {comprobante.cliente?.nombre || "Cliente General"}
            </p>
            {comprobante.cliente?.telefono && (
              <p className="text-sm font-medium text-foreground">
                Tel: {comprobante.cliente.telefono}
              </p>
            )}
            {comprobante.cliente?.correo && (
              <p className="text-sm font-medium text-foreground break-all sm:break-words">
                {comprobante.cliente.correo}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Store className="h-4 w-4" /> Cajero y Caja
            </span>
            <p className="font-bold text-base text-foreground">
              Cajero: {comprobante.user?.name || "-"}
            </p>
            {comprobante.caja?.nombre && (
              <p className="text-sm font-medium text-foreground">
                Caja: {comprobante.caja.nombre}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Fecha y Serie
            </span>
            <p className="font-bold text-base text-foreground">
              {comprobante.fecha_emision}
            </p>
            <p className="text-sm font-medium text-foreground">
              {comprobante.serie}-{comprobante.correlativo}
            </p>
          </div>
        </div>
      </Card>

      {comprobante.motivo_anulacion && (
        <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <span className="font-bold">Motivo de anulación: </span>
          {comprobante.motivo_anulacion}
        </div>
      )}
    </div>
  );
}
