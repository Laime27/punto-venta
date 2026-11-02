import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppPagination } from "@/components/AppPagination";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAjusteInventarioListar } from "../../hooks/general/useAjusteInventarioListar";
import { AjusteInventarioTableBody } from "./AjusteInventarioTableBody";
import { AjusteInventarioFilters } from "./AjusteInventarioFilters";
import { Puede } from "@/features/auth/components/Puede";

export function AjusteInventarioTable() {
  const navigate = useNavigate();
  const { data, pagination, filtros } = useAjusteInventarioListar();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Ajustes de Inventario
            <Badge>{data.total}</Badge>
          </h2>
          <p className="text-sm text-muted-foreground">
            Recuentos físicos, pérdidas y productos dañados.
          </p>
        </div>
        <Puede permiso="ajuste.crear">
          <Button onClick={() => navigate("/ajuste-inventario/crear")} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo ajuste
          </Button>
        </Puede>
      </div>

      <AjusteInventarioFilters filtros={filtros} />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center">Productos</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead className="w-20 text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <AjusteInventarioTableBody
              isLoading={data.isLoading}
              ajustes={data.ajustes}
              page={pagination.page}
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
    </div>
  );
}
