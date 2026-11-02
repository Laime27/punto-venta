import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OrdenCompraFormulario } from "../components/general/OrdenCompraFormulario";
import { useOrdenCompraCrear } from "../hooks/general/useOrdenCompraCrear";

export function OrdenCompraCrearPage() {
  const {
    form,
    detalles,
    enviando,
    funciones
  } = useOrdenCompraCrear();

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orden-compra")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nueva Orden de Compra</h1>
          <p className="text-sm text-muted-foreground">
            Complete los datos y agregue los productos a pedir.
          </p>
        </div>
      </div>

      <OrdenCompraFormulario
        form={form}
        detalles={detalles}
        enviando={enviando}
        funciones={funciones}
      />
    </div>
  );
}
