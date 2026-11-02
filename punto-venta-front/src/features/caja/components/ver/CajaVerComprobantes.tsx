import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { ComprobanteEstadoBadge } from "@/features/comprobante/components/ComprobanteEstadoBadge";
import type { ComprobanteType } from "@/features/comprobante/types/ComprobanteType";

interface Props {
  comprobantes: ComprobanteType[];
}

export function CajaVerComprobantes({ comprobantes }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          Comprobantes de la caja
          <Badge>{comprobantes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted border-b">
                <TableHead className="text-sm font-bold text-foreground">Comprobante</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Tipo</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Cliente</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Forma pago</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Pagos</TableHead>
                <TableHead className="text-right text-sm font-bold text-foreground">Total</TableHead>
                <TableHead className="text-center text-sm font-bold text-foreground">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comprobantes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-20 text-center text-muted-foreground">
                    No hay comprobantes en esta caja.
                  </TableCell>
                </TableRow>
              ) : (
                comprobantes.map((comprobante) => (
                  <TableRow key={comprobante.id}>
                    <TableCell className="text-sm font-bold whitespace-nowrap">
                      {`${comprobante.serie}-${comprobante.correlativo}`}
                    </TableCell>
                    <TableCell className="text-sm">{comprobante.tipo_comprobante?.nombre ?? "-"}</TableCell>
                    <TableCell className="text-sm">{comprobante.cliente?.nombre ?? "Cliente General"}</TableCell>
                    <TableCell className="text-sm uppercase">{comprobante.forma_pago ?? "contado"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {comprobante.pagos?.length
                        ? comprobante.pagos
                            .map((p) => `${p.metodo_pago?.nombre ?? "-"}: ${simbolo} ${Number(p.monto).toFixed(2)}`)
                            .join(" · ")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold whitespace-nowrap">
                      {simbolo} {Number(comprobante.total).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <ComprobanteEstadoBadge estado={comprobante.estado} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
