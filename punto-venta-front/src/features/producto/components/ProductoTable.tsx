import { Plus, Upload } from "lucide-react"
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
import { ProductoImportModal } from "./ProductoImportModal"
import { useProductoImportHook } from "../hooks/ProductoImportHook"
import { Card, CardContent } from "@/components/ui/card"

export function ProductoTable() {
  const { datos, paginacion, eliminar, filtrosState, listarSelectCategoria } = useProductoHook()
  const importHook = useProductoImportHook()
  const confirm = useConfirmDialog()
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          Productos
          <Badge>{datos.total}</Badge>
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={importHook.funciones.abrirModal} className="gap-2">
            <Upload className="h-4 w-4" />
            Importar Excel
          </Button>
          <Button onClick={() => navigate("/producto/crear")} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </div>
      </div>

      <div className="w-full">
        <ProductoCarts />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6 w-full">
            <ProductoFilters
              filtrosState={filtrosState}
              listarSelectCategoria={listarSelectCategoria}
            />
          </div>

          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Imagen</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>P. Costo</TableHead>
                  <TableHead>P. Costo x Mayor</TableHead>
                  <TableHead>P. Venta</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>En Venta</TableHead>
                  <TableHead className="w-28">Acciones</TableHead>
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

      <ConfirmDialog
        open={confirm.abierto}
        onClose={confirm.cerrar}
        onConfirm={() => eliminar(confirm.idSeleccionado!)}
        title="¿Eliminar producto?"
      />

      <ProductoImportModal
        importHook={importHook}
      />
    </div>
  )
}
