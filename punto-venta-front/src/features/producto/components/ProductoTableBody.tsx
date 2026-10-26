import { Loader2, ImageIcon, Pencil, Trash2 } from "lucide-react"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProductoType } from "../types/ProductoType"
import { formatearMoneda } from "@/lib/utils"
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook"

interface ProductoTableBodyProps {
  isLoading: boolean
  productos: ProductoType[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function ProductoTableBody({
  isLoading,
  productos,
  onEdit,
  onDelete,
}: ProductoTableBodyProps) {
  const { simbolo } = useMonedaHook()
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9} className="py-10 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (productos.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
            No hay productos registrados
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {productos.map((producto) => (
        <TableRow key={producto.id}>
          <TableCell>
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="mx-auto h-10 w-10 rounded-md object-cover"
              />
            ) : (
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </TableCell>
          <TableCell className="font-medium">
            {producto.nombre}
            <span className="mt-0.5 block text-xs">
              {producto.codigo_barras || ""}
            </span>
          </TableCell>
          <TableCell>
            {producto.categoria?.nombre ?? ""}
          </TableCell>
          <TableCell className="font-medium">
            {simbolo} {formatearMoneda(producto.precio_compra)}
          </TableCell>
          <TableCell className="font-medium">
            {simbolo} {formatearMoneda(producto.precio_mayoreo)}
          </TableCell>
          <TableCell className="font-medium">
            {simbolo} {formatearMoneda(producto.precio_venta)}
          </TableCell>
          <TableCell>
            {producto.stock}
          </TableCell>
          <TableCell>
            <Badge
              className={
                producto.disponible_venta ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              }
            >
              {producto.disponible_venta ? "Disponible" : "No Disponible"}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex justify-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-blue-600"
                onClick={() => onEdit(producto.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(producto.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
