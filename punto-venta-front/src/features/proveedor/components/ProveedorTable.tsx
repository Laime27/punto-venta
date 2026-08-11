import { useConfirmDialog } from "@/hooks/useConfirmDialog"
import { Plus } from "lucide-react"
import { AppPagination } from "@/components/AppPagination"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useProveedorHook } from "../hooks/ProveedorHook"
import { ProveedorModal } from "./ProveedorModal"
import { ProveedorTableBody } from "./ProveedorTableBody"
import { Badge } from "@/components/ui/badge"

export function ProveedorTable() {
  const { data, pagination, modal, eliminar } = useProveedorHook()
  const confirm = useConfirmDialog()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            Proveedores
            <Badge>{data.total}</Badge>
          </h2>
        </div>
        <Button onClick={modal.abrirCrear} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo proveedor
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="w-28 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <ProveedorTableBody
            isLoading={data.isLoading}
            proveedores={data.proveedores}
            page={pagination.page}
            onEdit={modal.abrirEditar}
            onDelete={confirm.abrir}
          />
        </Table>
      </div>

        <AppPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.setPage}
          disabled={data.isLoading}
        />

      <ProveedorModal
        open={modal.modalOpen}
        onClose={modal.cerrarModal}
        onSubmit={modal.onModalSubmit}
        proveedor={modal.selected}
      />

      <ConfirmDialog
        open={confirm.abierto}
        onClose={confirm.cerrar}
        onConfirm={() => eliminar(confirm.idSeleccionado!)}
        title="¿Eliminar proveedor?"
      />
    </div>
  )
}
