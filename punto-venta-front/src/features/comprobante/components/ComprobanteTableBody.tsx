import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Ban, HandCoins, Printer } from "lucide-react";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { ComprobanteEstadoBadge } from "./ComprobanteEstadoBadge";
import type { ComprobanteType } from "../types/ComprobanteType";
import { Puede } from "@/features/auth/components/Puede";

interface Props {
  isLoading: boolean;
  comprobantes: ComprobanteType[];
  pagina: number;
  perPage: number;
  onVerDetalle: (id: number) => void;
  onAnular: (comprobante: ComprobanteType) => void;
  onAbonar?: (id: number) => void;
  onImprimir: (id: number) => void;
  imprimiendo: boolean;
}

export function ComprobanteTableBody({
  isLoading,
  comprobantes,
  pagina,
  perPage,
  onVerDetalle,
  onAnular,
  onAbonar,
  onImprimir,
  imprimiendo,
}: Props) {
  const { simbolo } = useMonedaHook();
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={10} className="h-14">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (comprobantes.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={10} className="h-32 text-center">
            <div className="flex flex-col items-center justify-center gap-1.5">
              <p className="font-bold text-base text-foreground">
                No se encontraron comprobantes
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                Intenta ajustar los filtros de búsqueda o fecha
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {comprobantes.map((comprobante, index) => {
        const indice = (pagina - 1) * perPage + index + 1;
        const totalNumero = Number(comprobante.total || 0).toFixed(2);
        const esAnulado = comprobante.estado === "anulado";
        const esCredito = comprobante.forma_pago === "credito";

        return (
          <TableRow key={comprobante.id} className="hover:bg-muted/50">
            <TableCell className="font-bold text-sm text-foreground">
              {indice}
            </TableCell>
            <TableCell>
              <span className="font-bold text-sm text-foreground">
                {`${comprobante.serie}-${comprobante.correlativo}`}
              </span>
            </TableCell>
            <TableCell>
              {comprobante.tipo_comprobante?.nombre || ""}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`text-xs font-bold px-2 py-0.5 uppercase ${
                  esCredito
                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300"
                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300"
                }`}
              >
                {comprobante.forma_pago || "contado"}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold text-foreground">
                {comprobante.cliente?.nombre || "Cliente General"}
              </span>
            </TableCell>
            <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">
              {comprobante.fecha_emision}
            </TableCell>
            <TableCell className="text-sm font-medium text-foreground">
              {comprobante.user?.name || "-"}
            </TableCell>
            <TableCell className="text-right font-extrabold text-sm text-foreground whitespace-nowrap">
              {simbolo} {totalNumero}
            </TableCell>
            <TableCell className="text-center">
              <ComprobanteEstadoBadge estado={comprobante.estado} />
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1">
                {esCredito && !esAnulado && comprobante.estado !== "pagado" && onAbonar && (
                  <Puede permiso="comprobante.abonar">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      onClick={() => onAbonar(comprobante.id)}
                      title="Abonar Deuda"
                    >
                      <HandCoins className="h-4.5 w-4.5" />
                    </Button>
                  </Puede>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground hover:text-primary"
                  onClick={() => onVerDetalle(comprobante.id)}
                  title="Ver Detalle de Venta"
                >
                  <Eye className="h-4.5 w-4.5" />
                </Button>
                <Puede permiso="comprobante.imprimir">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-foreground hover:text-primary"
                    disabled={imprimiendo}
                    onClick={() => onImprimir(comprobante.id)}
                    title="Imprimir Ticket"
                  >
                    <Printer className="h-4.5 w-4.5" />
                  </Button>
                </Puede>
                {!esAnulado && (
                  <Puede permiso="comprobante.anular">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onAnular(comprobante)}
                      title="Anular Comprobante"
                    >
                      <Ban className="h-4.5 w-4.5" />
                    </Button>
                  </Puede>
                )}
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
