import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReportePaginacion } from "./ReportePaginacion";
import type { ColumnaReporte, PaginacionTabla } from "../types/ReporteType";

interface Props<T> {
  titulo?: string;
  accion?: ReactNode;
  columnas: ColumnaReporte<T>[];
  filas: T[];
  claveFila: (fila: T) => string | number;
  cargando: boolean;
  paginacion?: PaginacionTabla;
  mensajeVacio?: string;
}

const ALINEACION = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function ReporteTabla<T>({
  titulo,
  accion,
  columnas,
  filas,
  claveFila,
  cargando,
  paginacion,
  mensajeVacio = "No hay datos para los filtros seleccionados.",
}: Props<T>) {
  return (
    <Card>
      {(titulo || accion) && (
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          {titulo && <CardTitle className="text-base">{titulo}</CardTitle>}
          {accion}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columnas.map((columna) => (
                <TableHead key={columna.titulo} className={ALINEACION[columna.alinear ?? "left"]}>
                  {columna.titulo}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando && (
              <TableRow>
                <TableCell colSpan={columnas.length} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}

            {!cargando && filas.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnas.length} className="h-24 text-center text-muted-foreground">
                  {mensajeVacio}
                </TableCell>
              </TableRow>
            )}

            {!cargando && filas.map((fila) => (
              <TableRow key={claveFila(fila)}>
                {columnas.map((columna) => (
                  <TableCell key={columna.titulo} className={cn("text-sm tabular-nums", ALINEACION[columna.alinear ?? "left"])}>
                    {columna.celda(fila)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {paginacion && <ReportePaginacion paginacion={paginacion} deshabilitado={cargando} />}
      </CardContent>
    </Card>
  );
}
