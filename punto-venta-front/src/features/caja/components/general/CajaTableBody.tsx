import { useNavigate } from "react-router-dom";
import { Eye, Lock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { CajaEstadoBadge } from "./CajaEstadoBadge";
import { CajaDiferenciaBadge } from "./CajaDiferenciaBadge";
import { RegistrarMovimientoModal } from "../movimiento/RegistrarMovimientoModal";
import { CerrarCajaModal } from "../cerrar/CerrarCajaModal";
import type { Caja } from "../../types/CajaType";
import { Puede } from "@/features/auth/components/Puede";

interface Props {
  isLoading: boolean;
  cajas: Caja[];
}

export function CajaTableBody({ isLoading, cajas }: Props) {
  const { simbolo } = useMonedaHook();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={11} className="h-14">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (cajas.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
            No se encontraron cajas.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {cajas.map((caja) => (
        <TableRow key={caja.id} className="hover:bg-muted/50">
          <TableCell className="font-bold text-sm">{caja.id}</TableCell>
          <TableCell className="text-sm whitespace-nowrap">{caja.fecha_apertura}</TableCell>
          <TableCell className="text-sm whitespace-nowrap">{caja.fecha_cierre ?? "-"}</TableCell>
          <TableCell className="text-sm font-medium">{caja.abierto_por?.name ?? "-"}</TableCell>
          <TableCell className="text-sm font-medium">{caja.cerrado_por?.name ?? "-"}</TableCell>
          <TableCell className="text-right text-sm whitespace-nowrap">
            {simbolo} {Number(caja.monto_apertura).toFixed(2)}
          </TableCell>
          <TableCell className="text-right text-sm whitespace-nowrap">
            {caja.saldo_teorico !== null ? `${simbolo} ${Number(caja.saldo_teorico).toFixed(2)}` : "-"}
          </TableCell>
          <TableCell className="text-right text-sm font-bold whitespace-nowrap">
            {caja.monto_real !== null ? `${simbolo} ${Number(caja.monto_real).toFixed(2)}` : "-"}
          </TableCell>
          <TableCell className="text-center">
            <CajaDiferenciaBadge diferencia={caja.diferencia} />
          </TableCell>
          <TableCell className="text-center">
            <CajaEstadoBadge estado={caja.estado} />
          </TableCell>
          <TableCell className="text-center">
            <div className="flex justify-center gap-1">
              {caja.estado === "abierta" && (
                <>
                  <Puede permiso="caja.movimientos">
                    <RegistrarMovimientoModal
                      trigger={
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700" title="Registrar movimiento">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </Puede>
                  <Puede permiso="caja.cerrar">
                    <CerrarCajaModal
                      cajaId={caja.id}
                      trigger={
                        <Button variant="ghost" size="icon" className="text-destructive/80 hover:text-destructive" title="Cerrar caja">
                          <Lock className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </Puede>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/caja/${caja.id}/ver`)}
                title="Ver detalle"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
