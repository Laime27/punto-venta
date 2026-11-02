import { AppPagination } from "@/components/AppPagination";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useComprobanteHook } from "../hooks/useComprobanteHook";
import { ComprobanteFilters } from "./ComprobanteFilters";
import { ComprobanteTableBody } from "./ComprobanteTableBody";
import { ComprobanteDetalleModal } from "./ComprobanteDetalleModal";
import { ComprobanteMetricasCards } from "./ComprobanteMetricasCards";
import { AnularComprobanteModal } from "./AnularComprobanteModal";
import { useImprimirComprobanteHook } from "../hooks/useImprimirComprobanteHook";

export function ComprobanteTable() {
  const navigate = useNavigate();
  const { datos, paginacion, filtrosState, modales } = useComprobanteHook();
  const { imprimirComprobante, imprimiendo } = useImprimirComprobanteHook();

  const handlePerPageChange = (valor: string) => {
    filtrosState.setFiltros({ per_page: Number(valor) });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground">
            Comprobantes
            <Badge> {datos.total} </Badge>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm self-end sm:self-auto">
          <span className="text-sm font-bold text-foreground">Mostrar:</span>
          <Select
            value={String(filtrosState.filtros.per_page || 10)}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[85px] h-9 text-sm font-bold text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10" className="text-sm font-medium">10</SelectItem>
              <SelectItem value="25" className="text-sm font-medium">25</SelectItem>
              <SelectItem value="50" className="text-sm font-medium">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ComprobanteMetricasCards metricas={datos.metricas} isLoading={datos.isLoading} />

      <Card>
        <CardContent className="p-4 sm:p-5">
          <ComprobanteFilters
            search={filtrosState.search}
            setSearch={filtrosState.setSearch}
            filtros={filtrosState.filtros}
            setFiltros={filtrosState.setFiltros}
            onLimpiar={filtrosState.limpiarFiltros}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b">
                  <TableHead className="w-12 text-sm font-bold text-foreground">#</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Comprobante</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Tipo</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Forma Pago</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Cliente</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Fecha</TableHead>
                  <TableHead className="text-sm font-bold text-foreground">Cajero</TableHead>
                  <TableHead className="text-right text-sm font-bold text-foreground">Total</TableHead>
                  <TableHead className="text-center text-sm font-bold text-foreground">Estado</TableHead>
                  <TableHead className="text-center w-28 text-sm font-bold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <ComprobanteTableBody
                isLoading={datos.isLoading}
                comprobantes={datos.comprobantes}
                pagina={paginacion.pagina}
                perPage={filtrosState.filtros.per_page || 10}
                onVerDetalle={modales.abrirDetalle}
                onAnular={modales.abrirAnular}
                onAbonar={(id) => navigate(`/comprobante/${id}/abonar`)}
                onImprimir={imprimirComprobante}
                imprimiendo={imprimiendo}
              />
            </Table>
          </div>

          <div className="p-4 sm:p-6 border-t">
            <AppPagination
              page={paginacion.pagina}
              totalPages={paginacion.totalPaginas}
              onPageChange={paginacion.setPagina}
              disabled={datos.isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <ComprobanteDetalleModal
        open={modales.modalDetalleOpen}
        comprobanteId={modales.detalleId}
        onClose={modales.cerrarDetalle}
      />

      <AnularComprobanteModal
        open={modales.modalAnularOpen}
        comprobante={modales.comprobanteAnular}
        onClose={modales.cerrarAnular}
      />
    </div>
  );
}
