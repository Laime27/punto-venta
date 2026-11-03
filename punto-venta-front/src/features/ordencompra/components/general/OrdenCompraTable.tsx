import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppPagination } from "@/components/AppPagination";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrdenCompraListar } from "../../hooks/general/useOrdenCompraListar";
import { OrdenCompraTableBody } from "./OrdenCompraTableBody";
import { Card, CardContent } from "@/components/ui/card";
import { Puede } from "@/features/auth/components/Puede";

export function OrdenCompraTable() {
  const navigate = useNavigate();
  const { data, pagination, anulacion } = useOrdenCompraListar();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Órdenes de Compra
            <Badge>{data.total}</Badge>
          </h2>
        </div>
        <Puede permiso="orden_compra.crear">
          <Button onClick={() => navigate("/orden-compra/crear")} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva orden
          </Button>
        </Puede>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha Emisión</TableHead>
              <TableHead>Fecha Recepción</TableHead>
              <TableHead>Total Estimado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-28 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <OrdenCompraTableBody
            isLoading={data.isLoading}
            ordenesCompra={data.ordenesCompra}
            page={pagination.page}
            onAnular={anulacion.abrir}
          />
          </Table>

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

      <ConfirmDialog
        open={anulacion.abierto}
        onClose={anulacion.cerrar}
        onConfirm={anulacion.confirmar}
        title="¿Anular esta orden de compra?"
        confirmLabel="Sí, anular"
        cancelLabel="Volver"
      />
    </div>
  );
}
