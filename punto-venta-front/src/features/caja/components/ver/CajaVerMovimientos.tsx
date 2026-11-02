import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { MovimientoCaja, TipoMovimientoCaja } from "../../types/CajaType";

interface Props {
  movimientos: MovimientoCaja[];
  tipo: TipoMovimientoCaja | "todos";
  onTipoChange: (tipo: TipoMovimientoCaja | "todos") => void;
}

export function CajaVerMovimientos({ movimientos, tipo, onTipoChange }: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base font-bold">Movimientos de caja</CardTitle>
        <Select value={tipo} onValueChange={(val) => onTipoChange(val as TipoMovimientoCaja | "todos")}>
          <SelectTrigger className="w-[140px] h-9 text-sm font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ingreso">Ingresos</SelectItem>
            <SelectItem value="egreso">Egresos</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted border-b">
                <TableHead className="text-sm font-bold text-foreground">Fecha</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Tipo</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Motivo</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Observaciones</TableHead>
                <TableHead className="text-sm font-bold text-foreground">Usuario</TableHead>
                <TableHead className="text-right text-sm font-bold text-foreground">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                    No hay movimientos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                movimientos.map((mov) => {
                  const esIngreso = mov.tipo === "ingreso";
                  return (
                    <TableRow key={mov.id}>
                      <TableCell className="text-sm whitespace-nowrap">{mov.created_at}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs font-bold uppercase ${
                            esIngreso
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                              : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-300"
                          }`}
                        >
                          {mov.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{mov.motivo}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{mov.observaciones || "-"}</TableCell>
                      <TableCell className="text-sm">{mov.user?.name ?? "-"}</TableCell>
                      <TableCell
                        className={`text-right text-sm font-bold whitespace-nowrap ${
                          esIngreso ? "text-emerald-600" : "text-destructive"
                        }`}
                      >
                        {esIngreso ? "+" : "−"} {simbolo} {Number(mov.monto).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
