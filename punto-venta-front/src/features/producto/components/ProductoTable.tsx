import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AppPagination } from "@/components/AppPagination"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useConfirmDialog } from "@/hooks/useConfirmDialog"
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProductoHook } from "../hooks/ProductoHook"
import { ProductoCarts } from "./ProductoCarts"
import { ProductoTableBody } from "./ProductoTableBody"
import { ProductoFilters } from "./ProductoFilters"

export function ProductoTable() {
  const { datos, paginacion, eliminar, filtrosState, listarSelectCategoria } = useProductoHook()
  const confirm = useConfirmDialog()
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          Productos
          <Badge>{datos.total}</Badge>
        </h2>
        <Button onClick={() => navigate("/producto/crear")} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="w-full">
        <ProductoCarts />
      </div>

      <div className="w-full">
        <ProductoFilters 
          filtrosState={filtrosState} 
          listarSelectCategoria={listarSelectCategoria} 
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Imagen</TableHead>
              <TableHead className="text-center">Producto</TableHead>
              <TableHead className="text-center">Categoría</TableHead>
              <TableHead className="text-center">Costo</TableHead>
              <TableHead className="text-center">Costo x Mayor</TableHead>
              <TableHead className="text-center">Venta</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">En Venta</TableHead>
              <TableHead className="w-28 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <ProductoTableBody
            isLoading={datos.isLoading}
            productos={datos.productos}
            onEdit={(id) => navigate(`/producto/${id}/editar`)}
            onDelete={confirm.abrir}
          />
        </Table>
      </div>

      <AppPagination
        page={paginacion.pagina}
        totalPages={paginacion.totalPaginas}
        onPageChange={paginacion.setPagina}
        disabled={datos.isLoading}
      />

      <ConfirmDialog
        open={confirm.abierto}
        onClose={confirm.cerrar}
        onConfirm={() => eliminar(confirm.idSeleccionado!)}
        title="¿Eliminar producto?"
      />
    </div>
  )
}
