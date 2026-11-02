import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppPagination } from "@/components/AppPagination";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCotizacionListar } from "../../hooks/general/useCotizacionListar";
import { CotizacionTableBody } from "./CotizacionTableBody";
import { Card, CardContent } from "@/components/ui/card";
import { Puede } from "@/features/auth/components/Puede";

export function CotizacionTable() {
  const navigate = useNavigate();
  const { data, pagination } = useCotizacionListar();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Cotizaciones
            <Badge>{data.total}</Badge>
          </h2>
        </div>
        <Puede permiso="cotizacion.crear">
          <Button onClick={() => navigate("/cotizacion/crear")} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva cotización
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
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha Emisión</TableHead>
              <TableHead>Fecha Vencimiento</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-28 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <CotizacionTableBody
            isLoading={data.isLoading}
            cotizaciones={data.cotizaciones}
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
