import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useOrdenCompraRecibir } from "../hooks/recibir/useOrdenCompraRecibir";
import { OrdenCompraRecibirForm } from "../components/recibir/OrdenCompraRecibirForm";
import { OrdenCompraRecibirInfoGeneral } from "../components/recibir/OrdenCompraRecibirInfoGeneral";
import { OrdenCompraEstadoBadge } from "../components/general/OrdenCompraEstadoBadge";

export function OrdenCompraRecibirPage() {
  const {
    estado: { ordenCompra, isLoading, fields, formErrors, isSubmitting, totalRealCalculado },
    funciones: { register, handleSubmit, cancelar },
  } = useOrdenCompraRecibir();



  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Cargando orden de compra...</p>
      </div>
    );
  }

  if (!ordenCompra) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <p className="text-muted-foreground">No se encontró la orden de compra.</p>
        <Button variant="outline" onClick={cancelar}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={cancelar}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Recibir Orden de Compra</h1>
            <OrdenCompraEstadoBadge estado={ordenCompra.estado} />
          </div>
          <p className="text-sm text-muted-foreground">
            Registra los productos que van llegando al almacén.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <OrdenCompraRecibirForm
        fields={fields}
        formErrors={formErrors}
        register={register}
        ordenCompra={ordenCompra}
            />
          </div>
          <div className="space-y-4">
            <OrdenCompraRecibirInfoGeneral 
              ordenCompra={ordenCompra} 
              totalRealCalculado={totalRealCalculado} 
            />
            
            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Procesando..." : "Confirmar Recepción"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelar} className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
