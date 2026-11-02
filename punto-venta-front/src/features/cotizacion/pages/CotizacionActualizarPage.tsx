import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCotizacionActualizar } from "../hooks/general/useCotizacionActualizar";
import { CotizacionFormulario } from "../components/general/CotizacionFormulario";

export function CotizacionActualizarPage() {
  const { id } = useParams<{ id: string }>();
  const { form, detalles, enviando, isLoading, funciones } = useCotizacionActualizar(Number(id));

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Cargando cotización...</p>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/cotizacion">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Cotización</h1>
          <p className="text-sm text-muted-foreground">
            Actualiza los datos de la cotización seleccionada.
          </p>
        </div>
      </div>

      <CotizacionFormulario
        form={form}
        detalles={detalles}
        enviando={enviando}
        isEditMode={true}
        funciones={funciones}
      />
    </div>
  );
}
