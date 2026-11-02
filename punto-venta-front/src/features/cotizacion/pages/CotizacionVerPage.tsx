import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useCotizacionVer } from "../hooks/ver/useCotizacionVer";
import { CotizacionEstadoBadge } from "../components/general/CotizacionEstadoBadge";
import { CotizacionVerDetalles } from "../components/ver/CotizacionVerDetalles";
import { CotizacionVerInformacionGeneral } from "../components/ver/CotizacionVerInformacionGeneral";

export function CotizacionVerPage() {
  const { cotizacion, isLoading } = useCotizacionVer();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground animate-pulse">Cargando detalles de la cotización...</p>
      </div>
    );
  }

  if (!cotizacion) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <p className="text-muted-foreground">No se encontró la cotización.</p>
        <Button variant="outline" onClick={() => navigate("/cotizacion")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cotizacion")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Detalle de Cotización</h1>
            <CotizacionEstadoBadge estado={cotizacion.estado} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CotizacionVerDetalles detalles={cotizacion.detalles} />

          {cotizacion.observaciones && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{cotizacion.observaciones}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <CotizacionVerInformacionGeneral cotizacion={cotizacion} />
        </div>
      </div>
    </div>
  );
}

