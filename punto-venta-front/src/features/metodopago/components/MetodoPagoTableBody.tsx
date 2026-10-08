import { Loader2, Pencil } from "lucide-react"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { MetodoPagoType } from "../types/MetodopagoType"

interface MetodoPagoTableBodyProps {
  isLoading: boolean
  metodosPago: MetodoPagoType[]
  page: number
  onEdit: (id: number) => void
  onToggleEstado: (id: number) => void
}

export function MetodoPagoTableBody({
  isLoading,
  metodosPago,
  page,
  onEdit,
  onToggleEstado,
}: MetodoPagoTableBodyProps) {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="py-10 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (metodosPago.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
            No hay métodos de pago registrados
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {metodosPago.map((metodo, index) => (
        <TableRow key={metodo.id} onClick={() => onEdit(metodo.id)}>
          <TableCell className="font-medium">
            {(page - 1) * 10 + index + 1}
          </TableCell>
          <TableCell>{metodo.nombre}</TableCell>
          <TableCell className="capitalize">{metodo.tipo}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Switch
                checked={metodo.activo}
                onCheckedChange={() => onToggleEstado(metodo.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex justify-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-blue-600"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(metodo.id)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
