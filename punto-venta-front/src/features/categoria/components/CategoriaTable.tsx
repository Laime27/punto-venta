import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { Plus, Search } from "lucide-react";
import { AppPagination } from "@/components/AppPagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategoriaHook } from "../hooks/CategoriaHook";
import { CategoriaModal } from "./CategoriaModal";
import { CategoriaTableBody } from "./CategoriaTableBody";
import { Badge } from "@/components/ui/badge"
import { Puede } from "@/features/auth/components/Puede";

export function CategoriaTable() {
  const { data, pagination, modal, eliminar, searchTerm, setSearchTerm } = useCategoriaHook();

  const confirm = useConfirmDialog();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Categorías
            <Badge>{data.total}</Badge>
          </h2>
        </div>
        <Puede permiso="categoria.crear">
          <Button onClick={modal.abrirCrear} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva categoría
          </Button>
        </Puede>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6 flex items-center justify-end">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar categoría..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-28 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <CategoriaTableBody
                isLoading={data.isLoading}
                categorias={data.categorias}
                page={pagination.page}
                onEdit={modal.abrirEditar}
                onDelete={confirm.abrir}
              />
            </Table>
          </div>

          <div className="p-6">
            <AppPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.setPage}
              disabled={data.isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <CategoriaModal
        open={modal.modalOpen}
        onClose={modal.cerrarModal}
        onSubmit={modal.onModalSubmit}
        categoria={modal.selected}
      />

      <ConfirmDialog
        open={confirm.abierto}
        onClose={confirm.cerrar}
        onConfirm={() => eliminar(confirm.idSeleccionado!)}
        title="¿Eliminar categoría?"
      />
    </div>
  );
}
