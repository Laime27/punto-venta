import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCajaVer } from "../hooks/ver/useCajaVer";
import { CajaEstadoBadge } from "../components/general/CajaEstadoBadge";
import { RegistrarMovimientoModal } from "../components/movimiento/RegistrarMovimientoModal";
import { CerrarCajaModal } from "../components/cerrar/CerrarCajaModal";
import { CajaVerResumen } from "../components/ver/CajaVerResumen";
import { CajaVerInfoGeneral } from "../components/ver/CajaVerInfoGeneral";
import { CajaVerMovimientos } from "../components/ver/CajaVerMovimientos";
import { CajaVerComprobantes } from "../components/ver/CajaVerComprobantes";

export function CajaVerPage() {
  const navigate = useNavigate();
  const {
    estado: { caja, resumen, movimientos, tipoMovimiento, isLoading },
    funciones: { setTipoMovimiento },
  } = useCajaVer();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground animate-pulse">Cargando detalle de la caja...</p>
      </div>
    );
  }

  if (!caja || !resumen) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <p className="text-muted-foreground">No se encontró la caja.</p>
        <Button variant="outline" onClick={() => navigate("/caja")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/caja")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Caja #{caja.id}</h1>
          <CajaEstadoBadge estado={caja.estado} />
        </div>

        {caja.estado === "abierta" && (
          <div className="flex gap-2">
            <RegistrarMovimientoModal
              trigger={
                <Button variant="outline" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Registrar movimiento
                </Button>
              }
            />
            <CerrarCajaModal
              cajaId={caja.id}
              trigger={
                <Button variant="destructive" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Cerrar caja
                </Button>
              }
            />
          </div>
        )}
      </div>

      <CajaVerResumen resumen={resumen} />
      <CajaVerInfoGeneral caja={caja} resumen={resumen} />
      <CajaVerMovimientos movimientos={movimientos} tipo={tipoMovimiento} onTipoChange={setTipoMovimiento} />
      <CajaVerComprobantes comprobantes={caja.comprobantes} />
    </div>
  );
}
