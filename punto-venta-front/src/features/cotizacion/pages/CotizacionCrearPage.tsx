import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCotizacionCrear } from "../hooks/general/useCotizacionCrear";
import { CotizacionFormulario } from "../components/general/CotizacionFormulario";

export function CotizacionCrearPage() {
  const { form, detalles, enviando, funciones } = useCotizacionCrear();

  return (
    <div className="p-6 mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/cotizacion">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nueva Cotización</h1>
          <p className="text-sm text-muted-foreground">
            Crea una nueva cotización para enviarla a un cliente.
          </p>
        </div>
      </div>

      <CotizacionFormulario
        form={form}
        detalles={detalles}
        enviando={enviando}
        funciones={funciones}
      />
    </div>
  );
}
