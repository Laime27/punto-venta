import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAjusteInventarioVer } from "../hooks/ver/useAjusteInventarioVer";
import { AjusteInventarioVerDetalles } from "../components/ver/AjusteInventarioVerDetalles";
import { AjusteInventarioVerInfoGeneral } from "../components/ver/AjusteInventarioVerInfoGeneral";
import { AjusteInventarioTipoBadge } from "../components/general/AjusteInventarioTipoBadge";
import { TIPOS_AJUSTE } from "../validations/AjusteInventarioValidation";

export function AjusteInventarioVerPage() {
  const {
    estado: { ajuste, detalles, valorPerdido, isLoading },
    funciones: { volver },
  } = useAjusteInventarioVer();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground animate-pulse">Cargando ajuste de inventario...</p>
      </div>
    );
  }

  if (!ajuste) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <p className="text-muted-foreground">No se encontró el ajuste de inventario.</p>
        <Button variant="outline" onClick={volver}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  const tipo = TIPOS_AJUSTE.find((t) => t.id === ajuste.tipo_movimiento_id) ?? TIPOS_AJUSTE[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={volver}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Ajuste {ajuste.serie}-{ajuste.correlativo}</h1>
            <AjusteInventarioTipoBadge tipoId={ajuste.tipo_movimiento_id} />
          </div>
          <p className="text-sm text-muted-foreground">Detalle de los cambios de stock registrados.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <AjusteInventarioVerDetalles detalles={detalles} etiquetaCantidad={tipo.etiquetaCantidad} />
        </div>
        <AjusteInventarioVerInfoGeneral ajuste={ajuste} totalProductos={detalles.length} valorPerdido={valorPerdido} />
      </div>
    </div>
  );
}
