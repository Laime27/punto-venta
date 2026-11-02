import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKardexHook } from "../hooks/useKardexHook";
import { KardexEncabezado } from "../components/KardexEncabezado";
import { KardexFiltros } from "../components/KardexFiltros";
import { KardexResumen } from "../components/KardexResumen";
import { KardexTabla } from "../components/KardexTabla";

export default function KardexPage() {
  const { estado, paginacion, filtros, funciones } = useKardexHook();

  if (estado.isLoading && !estado.producto) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (estado.isError || !estado.producto || !estado.resumen) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <p className="text-muted-foreground">No se pudo cargar el kardex del producto.</p>
        <Button variant="outline" onClick={funciones.volver}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a productos
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <KardexEncabezado
        producto={estado.producto}
        exportando={estado.exportando}
        onExportar={funciones.exportar}
        onVolver={funciones.volver}
      />
      <KardexFiltros filtros={filtros} />
      <KardexResumen resumen={estado.resumen} abreviatura={estado.producto.unidad?.abreviatura} />
      <KardexTabla movimientos={estado.movimientos} isLoading={estado.isFetching} paginacion={paginacion} />
    </div>
  );
}
