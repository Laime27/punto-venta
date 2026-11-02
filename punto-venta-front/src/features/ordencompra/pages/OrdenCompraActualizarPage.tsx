import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OrdenCompraFormulario } from "../components/general/OrdenCompraFormulario";
import { useOrdenCompraActualizar } from "../hooks/general/useOrdenCompraActualizar";

export function OrdenCompraActualizarPage() {
  const {
    form,
    detalles,
    enviando,
    cargandoOrden,
    funciones
  } = useOrdenCompraActualizar();

  const navigate = useNavigate();

  if (cargandoOrden) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Cargando orden de compra...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orden-compra")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Orden de Compra</h1>
          <p className="text-sm text-muted-foreground">
            Modifique los datos o productos de la orden en estado pendiente.
          </p>
        </div>
      </div>

      <OrdenCompraFormulario
        form={form}
        detalles={detalles}
        enviando={enviando}
        isEditMode={true}
        funciones={funciones}
      />
    </div>
  );
}
