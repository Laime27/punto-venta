import { Loader2, Pencil, Trash2 } from "lucide-react"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { CategoriaType } from "../types/CategoriaType"

interface CategoriaTableBodyProps {
  isLoading: boolean
  categorias: CategoriaType[]
  page: number
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function CategoriaTableBody({
  isLoading,
  categorias,
  page,
  onEdit,
  onDelete,
}: CategoriaTableBodyProps) {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="py-10 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (categorias.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
            No hay categorías registradas
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {categorias.map((categoria, index) => (
        <TableRow key={categoria.id} onClick={() => onEdit(categoria.id)}>
          <TableCell className="font-medium text-muted-foreground">
            {(page - 1) * 10 + index + 1}
          </TableCell>
          <TableCell>{categoria.nombre}</TableCell>
          <TableCell>
            <div className="flex justify-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-blue-600"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(categoria.id)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(categoria.id)
                }}
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
