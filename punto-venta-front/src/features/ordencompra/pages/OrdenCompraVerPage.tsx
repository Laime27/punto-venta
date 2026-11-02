import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useOrdenCompraVer } from "../hooks/ver/useOrdenCompraVer";
import { OrdenCompraVerDetalles } from "../components/ver/OrdenCompraVerDetalles";
import { OrdenCompraVerObservaciones } from "../components/ver/OrdenCompraVerObservaciones";
import { OrdenCompraVerInfoGeneral } from "../components/ver/OrdenCompraVerInfoGeneral";
import { OrdenCompraEstadoBadge } from "../components/general/OrdenCompraEstadoBadge";

export function OrdenCompraVerPage() {
  const {
    estado: { ordenCompra, isLoading },
    funciones: { volver },
  } = useOrdenCompraVer();



  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground animate-pulse">Cargando detalles de la orden...</p>
      </div>
    );
  }

  if (!ordenCompra) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <p className="text-muted-foreground">No se encontró la orden de compra.</p>
        <Button variant="outline" onClick={volver}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }


  return (
    <div className="p-6  mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={volver}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Detalle de Orden de Compra</h1>
            <OrdenCompraEstadoBadge estado={ordenCompra.estado} />
          </div>
          <p className="text-sm text-muted-foreground">
            Revisión general de la orden creada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <OrdenCompraVerDetalles detalles={ordenCompra.detalles} />
          <OrdenCompraVerObservaciones observaciones={ordenCompra.observaciones} />
        </div>

        <OrdenCompraVerInfoGeneral ordenCompra={ordenCompra}  />
      </div>
    </div>
  );
}
