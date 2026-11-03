import { History, Loader2 } from "lucide-react";
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
  hayFiltros: boolean;
  paginacion: {
    pagina: number;
    totalPaginas: number;
    setPagina: (pagina: number) => void;
  };
}

const COLUMNAS = 8;

const documentoDe = (movimiento: KardexMovimientoType) =>
  movimiento.documento?.serie ? `${movimiento.documento.serie}-${movimiento.documento.correlativo}` : "";

const capitalizar = (texto = "") => {
  const minusculas = texto.toLocaleLowerCase("es");
  return minusculas.charAt(0).toLocaleUpperCase("es") + minusculas.slice(1);
};

export function KardexTabla({ movimientos, isLoading, hayFiltros, paginacion }: Props) {
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
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Detalle</TableHead>
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
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={COLUMNAS} className="h-40 text-center">
                  <History className="mx-auto mb-2 h-8 w-8 text-muted-foreground/60" />
                  <p className="font-medium">
                    {hayFiltros ? "No hay movimientos en estas fechas" : "Este producto aún no tiene movimientos"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hayFiltros
                      ? "Prueba con otro rango de fechas."
                      : "Aquí verás sus ventas, compras y ajustes de inventario."}
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && movimientos.map((movimiento) => {
              const esEntrada = movimiento.operacion === "+";
              const cantidad = Number(movimiento.cantidad);
              const [fecha, hora] = (movimiento.fecha_emision ?? "-").split(" ");

              return (
                <TableRow key={movimiento.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    <div>{fecha}</div>
                    <div className="text-xs text-muted-foreground">{hora?.slice(0, 5)}</div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{capitalizar(movimiento.tipo_movimiento?.nombre)}</TableCell>
                  <TableCell className="text-sm">
                    <div>{movimiento.nombre_documento}</div>
                    <div className="text-xs text-muted-foreground">{documentoDe(movimiento)}</div>
                  </TableCell>
                  <TableCell className="text-sm">{movimiento.user?.name ?? "-"}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">{esEntrada ? `+${cantidad}` : ""}</TableCell>
                  <TableCell className="text-right font-semibold text-red-600">{esEntrada ? "" : `-${cantidad}`}</TableCell>
                  <TableCell className="text-right font-bold">{Number(movimiento.stock_actual)}</TableCell>
                  <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground" title={movimiento.observacion ?? ""}>
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
