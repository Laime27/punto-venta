import { Loader2, Mail, Phone, MapPin, Pencil, Trash2 } from "lucide-react"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { ClienteType } from "../types/ClienteType"
import { Puede } from "@/features/auth/components/Puede"
import { usePermisos } from "@/features/auth/hooks/usePermisos"

interface ClienteTableBodyProps {
  isLoading: boolean
  clientes: ClienteType[]
  page: number
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function ClienteTableBody({
  isLoading,
  clientes,
  page,
  onEdit,
  onDelete,
}: ClienteTableBodyProps) {
  const { puede } = usePermisos()
  const puedeEditar = puede("cliente.editar")
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

  if (clientes.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
            No hay clientes registrados
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {clientes.map((cliente, index) => (
        <TableRow key={cliente.id} onClick={puedeEditar ? () => onEdit(cliente.id) : undefined}>
          <TableCell className="font-medium">
            {(page - 1) * 10 + index + 1}
          </TableCell>
          <TableCell>
            <div>{cliente.nombre}</div>
            {cliente.nota && (
              <div className="mt-1 max-w-[200px] truncate text-xs">
                {cliente.nota}
              </div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1 text-sm">
              {cliente.correo && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {cliente.correo}
                </span>
              )}
              {cliente.telefono && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {cliente.telefono}
                </span>
              )}
              {!cliente.correo && !cliente.telefono && " "}
            </div>
          </TableCell>
          <TableCell>
            {cliente.direccion ? (
              <span className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                {cliente.direccion}
              </span>
            ) : (
              " "
            )}
          </TableCell>
          <TableCell>
            <div className="flex justify-center gap-2">
              <Puede permiso="cliente.editar">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(cliente.id)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </Puede>
              {!cliente.es_sistema && (
                <Puede permiso="cliente.eliminar">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(cliente.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Puede>
              )}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
