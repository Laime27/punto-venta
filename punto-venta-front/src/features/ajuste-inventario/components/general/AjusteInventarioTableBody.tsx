import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AjusteInventarioTipoBadge } from "./AjusteInventarioTipoBadge";
import type { AjusteInventarioType } from "../../types/AjusteInventarioType";

interface Props {
  isLoading: boolean;
  ajustes: AjusteInventarioType[];
  page: number;
}

const COLUMNAS = 8;

export function AjusteInventarioTableBody({ isLoading, ajustes, page }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={COLUMNAS} className="h-14">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (ajustes.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={COLUMNAS} className="h-24 text-center text-muted-foreground">
            No se encontraron ajustes de inventario.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {ajustes.map((ajuste, index) => (
        <TableRow key={ajuste.id}>
          <TableCell className="font-medium">{(page - 1) * 10 + index + 1}</TableCell>
          <TableCell className="font-medium">{ajuste.serie}-{ajuste.correlativo}</TableCell>
          <TableCell><AjusteInventarioTipoBadge tipoId={ajuste.tipo_movimiento_id} /></TableCell>
          <TableCell className="text-sm whitespace-nowrap">{ajuste.fecha_emision}</TableCell>
          <TableCell className="text-center">{ajuste.detalles_count ?? 0}</TableCell>
          <TableCell className="text-sm max-w-[280px] truncate" title={ajuste.motivo ?? ""}>
            {ajuste.motivo || <span className="text-muted-foreground">-</span>}
          </TableCell>
          <TableCell className="text-sm">{ajuste.user?.name ?? "-"}</TableCell>
          <TableCell className="text-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/ajuste-inventario/${ajuste.id}/ver`)}
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
