import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppPagination } from "@/components/AppPagination";
import type { KardexMovimientoType } from "../types/KardexType";

interface Props {
  movimientos: KardexMovimientoType[];
  isLoading: boolean;
  paginacion: {
    pagina: number;
    totalPaginas: number;
    setPagina: (pagina: number) => void;
  };
}

const COLUMNAS = 8;

const documentoDe = (movimiento: KardexMovimientoType) =>
  movimiento.documento?.serie ? `${movimiento.documento.serie}-${movimiento.documento.correlativo}` : "";

export function KardexTabla({ movimientos, isLoading, paginacion }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Movimiento</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="text-right">Entrada</TableHead>
              <TableHead className="text-right">Salida</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead>Observación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={COLUMNAS} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && movimientos.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNAS} className="h-24 text-center text-muted-foreground">
                  No hay movimientos en el rango seleccionado.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && movimientos.map((movimiento) => {
              const esEntrada = movimiento.operacion === "+";
              const cantidad = Number(movimiento.cantidad);

              return (
                <TableRow key={movimiento.id}>
                  <TableCell className="text-sm whitespace-nowrap">{movimiento.fecha_emision ?? "-"}</TableCell>
                  <TableCell className="text-sm">{movimiento.tipo_movimiento?.nombre}</TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium">{movimiento.nombre_documento}</div>
                    <div className="text-xs text-muted-foreground">{documentoDe(movimiento)}</div>
                  </TableCell>
                  <TableCell className="text-sm">{movimiento.user?.name ?? "-"}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">{esEntrada ? cantidad : ""}</TableCell>
                  <TableCell className="text-right font-medium text-red-600">{esEntrada ? "" : cantidad}</TableCell>
                  <TableCell className="text-right font-bold">{Number(movimiento.stock_actual)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[260px] truncate" title={movimiento.observacion ?? ""}>
                    {movimiento.observacion ?? ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="p-6">
          <AppPagination
            page={paginacion.pagina}
            totalPages={paginacion.totalPaginas}
            onPageChange={paginacion.setPagina}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
