import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Ban, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { type OrdenCompraType } from "../../types/OrdenCompraType";
import { OrdenCompraEstadoBadge } from "./OrdenCompraEstadoBadge";
import { Puede } from "@/features/auth/components/Puede";

interface Props {
  isLoading: boolean;
  ordenesCompra: OrdenCompraType[];
  page: number;
  onAnular: (id: number) => void;
}

export function OrdenCompraTableBody({ isLoading, ordenesCompra, page, onAnular }: Props) {
  const { simbolo } = useMonedaHook();
  const navigate = useNavigate();
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

  if (ordenesCompra.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
            No se encontraron órdenes de compra.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }



  return (
    <TableBody>
      {ordenesCompra.map((orden, index) => {

        return (
          <TableRow key={orden.id}>
            <TableCell className="font-medium">
              {(page - 1) * 10 + index + 1}
            </TableCell>
            <TableCell>{orden.serie ? `${orden.serie}-${orden.correlativo}` : ""}</TableCell>
            <TableCell>{orden.proveedor?.nombre || ""}</TableCell>
            <TableCell>{orden.fecha_emision || "-"}</TableCell>
            <TableCell>{orden.fecha_recepcion || "-"}</TableCell>
            <TableCell>{simbolo} {Number(orden.total_estimado ?? 0).toFixed(2)}</TableCell>
            <TableCell><OrdenCompraEstadoBadge estado={orden.estado} /></TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/orden-compra/${orden.id}/ver`)}
                  title="Ver detalle"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {orden.estado === "PENDIENTE" && (
                  <Puede permiso="orden_compra.editar">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => navigate(`/orden-compra/${orden.id}/editar`)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Puede>
                )}
                {orden.estado === "PENDIENTE" && (
                  <Puede permiso="orden_compra.editar">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onAnular(orden.id)}
                      title="Anular"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </Puede>
                )}
                {!["RECIBIDA_COMPLETA", "ANULADA"].includes(orden.estado) && (
                  <Puede permiso="orden_compra.recibir">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => navigate(`/orden-compra/${orden.id}/recibir`)}
                      title="Recibir"
                    >
                      <ArrowDownToLine className="h-4 w-4" />
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
