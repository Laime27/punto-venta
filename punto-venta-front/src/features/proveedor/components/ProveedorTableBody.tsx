import { Loader2, Mail, Phone, MapPin, Pencil, Trash2 } from "lucide-react"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { ProveedorType } from "../types/ProveedorType"
import { Puede } from "@/features/auth/components/Puede"
import { usePermisos } from "@/features/auth/hooks/usePermisos"

interface ProveedorTableBodyProps {
  isLoading: boolean
  proveedores: ProveedorType[]
  page: number
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function ProveedorTableBody({
  isLoading,
  proveedores,
  page,
  onEdit,
  onDelete,
}: ProveedorTableBodyProps) {
  const { puede } = usePermisos()
  const puedeEditar = puede("proveedor.editar")
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

  if (proveedores.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
            No hay proveedores registrados
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {proveedores.map((proveedor, index) => (
        <TableRow key={proveedor.id} onClick={puedeEditar ? () => onEdit(proveedor.id) : undefined}>
          <TableCell className="font-medium">
            {(page - 1) * 10 + index + 1}
          </TableCell>
          <TableCell>
            <div>{proveedor.nombre}</div>
            {proveedor.nota && (
              <div className="mt-1 max-w-[200px] truncate text-xs">
                {proveedor.nota}
              </div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1 text-sm">
              {proveedor.correo && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {proveedor.correo}
                </span>
              )}
              {proveedor.telefono && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {proveedor.telefono}
                </span>
              )}
              {!proveedor.correo && !proveedor.telefono && " "}
            </div>
          </TableCell>
          <TableCell>
            {proveedor.direccion ? (
              <span className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                {proveedor.direccion}
              </span>
            ) : (
              " "
            )}
          </TableCell>
          <TableCell>
            <div className="flex justify-center gap-2">
              <Puede permiso="proveedor.editar">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(proveedor.id)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </Puede>
              <Puede permiso="proveedor.eliminar">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(proveedor.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Puede>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
