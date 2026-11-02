import { AppPagination } from "@/components/AppPagination"
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useHistorialMovimientoHook } from "../hooks/HistorialMovimientoHook"
import { HistorialMovimientoTableBody } from "./HistorialMovimientoTableBody"
import { HistorialMovimientoFilters } from "./HistorialMovimientoFilters"
import { Card, CardContent } from "@/components/ui/card"

export function HistorialMovimientoTable() {
  const { datos, paginacion, filtros } = useHistorialMovimientoHook()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          Historial de Movimientos
          <Badge>{datos.total}</Badge>
        </h2>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Mostrar:</span>
          <Select
            value={String(filtros.valores.per_page)}
            onValueChange={(value) => filtros.cambiarFiltros({ per_page: Number(value) })}
          >
            <SelectTrigger className="w-[80px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <HistorialMovimientoFilters filtros={filtros} />

      <Card>
        <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo Movimiento</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Stock Ant.</TableHead>
                  <TableHead className="text-right">Stock Act.</TableHead>
                </TableRow>
              </TableHeader>
              <HistorialMovimientoTableBody
                isLoading={datos.isLoading}
                historial={datos.historial}
              />
            </Table>

          <div className="p-6">
            <AppPagination
              page={paginacion.pagina}
              totalPages={paginacion.totalPaginas}
              onPageChange={paginacion.setPagina}
              disabled={datos.isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
