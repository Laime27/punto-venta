import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, ArrowRightLeft, FileText, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { type CotizacionType } from "../../types/CotizacionType";
import { CotizacionEstadoBadge } from "./CotizacionEstadoBadge";
import { CotizacionCambiarEstadoDialog } from "./CotizacionCambiarEstadoDialog";
import { useCotizacionTableActions } from "../../hooks/general/useCotizacionTableActions";
import { Puede } from "@/features/auth/components/Puede";

interface Props {
  isLoading: boolean;
  cotizaciones: CotizacionType[];
  page: number;
}

export function CotizacionTableBody({ isLoading, cotizaciones, page }: Props) {
  const { simbolo } = useMonedaHook();
  const navigate = useNavigate();
  const { cotizacionSeleccionada, setCotizacionSeleccionada, verPdf } = useCotizacionTableActions();

  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={8} className="h-14">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (cotizaciones.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
            No se encontraron cotizaciones.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {cotizaciones.map((cotizacion, index) => (
          <TableRow key={cotizacion.id}>
            <TableCell className="font-medium">
              {(page - 1) * 10 + index + 1}
            </TableCell>
            <TableCell>{cotizacion.serie ? `${cotizacion.serie}-${cotizacion.correlativo}` : "-"}</TableCell>
            <TableCell>{cotizacion.cliente?.nombre ? `${cotizacion.cliente.nombre}` : "-"}</TableCell>
            <TableCell>{cotizacion.fecha_emision ? cotizacion.fecha_emision.split("T")[0] : "-"}</TableCell>
            <TableCell>{cotizacion.fecha_vencimiento ? cotizacion.fecha_vencimiento.split("T")[0] : "-"}</TableCell>
            <TableCell>{simbolo} {Number(cotizacion.total ?? 0).toFixed(2)}</TableCell>
            <TableCell>
              <CotizacionEstadoBadge estado={cotizacion.estado} />
              {cotizacion.comprobante && (
                <div className="mt-1 text-xs font-medium text-muted-foreground">
                  Venta {cotizacion.comprobante.serie}-{cotizacion.comprobante.correlativo}
                </div>
              )}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/cotizacion/${cotizacion.id}/ver`)}
                  title="Ver detalle"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Puede permiso="cotizacion.pdf">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => verPdf(cotizacion.id!)}
                    title="Ver PDF"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </Puede>
                {cotizacion.estado === "ACEPTADA" && !cotizacion.comprobante_id && (
                  <Puede permiso="venta.desde_cotizacion">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-emerald-600 hover:text-emerald-700"
                      onClick={() => navigate(`/punto-venta?cotizacion=${cotizacion.id}`)}
                      title="Convertir en venta"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </Puede>
                )}
                {cotizacion.estado === "PENDIENTE" && (
                  <>
                    <Puede permiso="cotizacion.editar">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => navigate(`/cotizacion/${cotizacion.id}/editar`)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Puede>
                    <Puede permiso="cotizacion.cambiar_estado">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-orange-600 hover:text-orange-700"
                        onClick={() => setCotizacionSeleccionada(cotizacion)}
                        title="Cambiar Estado"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </Puede>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <CotizacionCambiarEstadoDialog 
        cotizacion={cotizacionSeleccionada}
        onClose={() => setCotizacionSeleccionada(null)}
      />
    </>
  );
}
