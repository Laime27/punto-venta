import { Loader2 } from "lucide-react"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { HistorialMovimientoType } from "../types/HistorialMovimientoType"
import { Badge } from "@/components/ui/badge"

interface HistorialMovimientoTableBodyProps {
  isLoading: boolean
  historial: HistorialMovimientoType[]
}

export function HistorialMovimientoTableBody({
  isLoading,
  historial,
}: HistorialMovimientoTableBodyProps) {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9} className="h-24 text-center">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (historial.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
            No hay movimientos registrados.
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {historial.map((mov) => {
        const isEntrada = mov.operacion === "+";
        const operacionColor = isEntrada ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

        return (
          <TableRow key={mov.id}>
            <TableCell>{mov.user?.name}</TableCell>
            <TableCell>
              <div className="font-medium text-sm">
                {mov.fecha_emision ? mov.fecha_emision.split(/[T ]/)[0] : '-'}
              </div>
              <div className="text-md text-muted-foreground">
                {mov.fecha_emision ? (mov.fecha_emision.split(/[T ]/)[1]?.substring(0, 5) || '') : ''}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{mov.nombre_documento}</div>
              {mov.documento && (
                <div className="text-xs text-muted-foreground">
                  {mov.documento.serie && mov.documento.correlativo
                    ? `${mov.documento.serie}-${mov.documento.correlativo}`
                    : (mov.documento.serie || mov.documento.correlativo || '')}
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">
              {mov.producto?.nombre}
              <div className="text-xs text-muted-foreground">{mov.producto?.codigo_barras}</div>
            </TableCell>
            <TableCell>{mov.tipo_movimiento?.nombre}</TableCell>
            <TableCell>
              <Badge variant="outline" className={operacionColor}>
                {mov.operacion.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{mov.cantidad}</TableCell>
            <TableCell className="text-right text-muted-foreground">{mov.stock_anterior}</TableCell>
            <TableCell className="text-right font-medium">{mov.stock_actual}</TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}
