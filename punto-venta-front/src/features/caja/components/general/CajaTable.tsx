import { AppPagination } from "@/components/AppPagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCajaListar } from "../../hooks/general/useCajaListar";
import { AbrirCajaModal } from "../abrir/AbrirCajaModal";
import { CajaFilters } from "./CajaFilters";
import { CajaTableBody } from "./CajaTableBody";
import { Puede } from "@/features/auth/components/Puede";

export function CajaTable() {
  const { data, pagination, filtros } = useCajaListar();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          Cajas
          <Badge>{data.total}</Badge>
        </h2>
        {data.puedeAbrirCaja && (
          <Puede permiso="caja.abrir">
            <AbrirCajaModal />
          </Puede>
        )}
      </div>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <CajaFilters filtros={filtros} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b">
                  <TableHead className="w-12 text-sm font-bold text-foreground">#</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Apertura</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Cierre</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Abierto por</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Cerrado por</TableHead>
                  <TableHead className="text-right text-sm font-bold text-foreground">Monto apertura</TableHead>
                  <TableHead className="text-right text-sm font-bold text-foreground">Saldo teórico</TableHead>
                  <TableHead className="text-right text-sm font-bold text-foreground">Monto real</TableHead>
                  <TableHead className="text-center text-sm font-bold text-foreground">Diferencia</TableHead>
                  <TableHead className="text-center text-sm font-bold text-foreground">Estado</TableHead>
                  <TableHead className="text-center w-32 text-sm font-bold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <CajaTableBody isLoading={data.isLoading} cajas={data.cajas} />
            </Table>
          </div>

          <div className="p-4 sm:p-6 border-t">
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
