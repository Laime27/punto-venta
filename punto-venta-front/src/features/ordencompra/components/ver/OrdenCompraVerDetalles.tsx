import { PackageOpen } from "lucide-react";
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
import type { OrdenCompraDetalleType } from "../../types/OrdenCompraType";

interface Props {
  detalles: OrdenCompraDetalleType[];
}

export function OrdenCompraVerDetalles({ detalles }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PackageOpen className="h-4 w-4" />
          Productos de la Orden
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center w-24">Cant. Pedida</TableHead>
              <TableHead className="text-center w-28">Cant. Recibida</TableHead>
              <TableHead className="text-center w-28">P. Unitario</TableHead>
              <TableHead className="text-right w-36">Subtotal Estimado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalles.map((detalle, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{detalle.producto?.nombre ?? "S/N"}</TableCell>
                <TableCell className="text-center">{detalle.cantidad_pedida}</TableCell>
                <TableCell className="text-center">
                  <span className={detalle.cantidad_recibida === detalle.cantidad_pedida ? "text-green-600 font-medium" : "text-orange-500 font-medium"}>
                    {detalle.cantidad_recibida ?? 0}
                  </span>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {simbolo} {Number(detalle.precio_unitario).toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {simbolo} {(detalle.cantidad_pedida * Number(detalle.precio_unitario)).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {detalles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No hay detalles en esta orden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </CardContent>
    </Card>
  );
}
