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
import type { AjusteInventarioDetalleType } from "../../types/AjusteInventarioType";

interface Props {
  detalles: AjusteInventarioDetalleType[];
  etiquetaCantidad: string;
}

export function AjusteInventarioVerDetalles({ detalles, etiquetaCantidad }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PackageOpen className="h-4 w-4" />
          Productos ajustados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center w-28">Stock anterior</TableHead>
                <TableHead className="text-center w-32">{etiquetaCantidad}</TableHead>
                <TableHead className="text-center w-28">Stock nuevo</TableHead>
                <TableHead className="text-center w-28">Diferencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalles.map((detalle) => {
                const diferencia = Number(detalle.diferencia);
                const color =
                  diferencia > 0 ? "text-emerald-600" : diferencia < 0 ? "text-red-600" : "text-muted-foreground";

                return (
                  <TableRow key={detalle.id}>
                    <TableCell>
                      <p className="font-medium">{detalle.producto?.nombre ?? "S/N"}</p>
                      {detalle.producto?.codigo_barras && (
                        <p className="text-xs text-muted-foreground">{detalle.producto.codigo_barras}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{Number(detalle.stock_anterior)}</TableCell>
                    <TableCell className="text-center">{Number(detalle.cantidad)}</TableCell>
                    <TableCell className="text-center font-medium">{Number(detalle.stock_actual)}</TableCell>
                    <TableCell className={`text-center font-semibold ${color}`}>
                      {diferencia > 0 ? "+" : ""}{diferencia}
                    </TableCell>
                  </TableRow>
                );
              })}
              {detalles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No hay productos en este ajuste.
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
