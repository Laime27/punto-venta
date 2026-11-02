import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAjusteInventarioCrear } from "../hooks/crear/useAjusteInventarioCrear";
import { AjusteInventarioDetalles } from "../components/crear/AjusteInventarioDetalles";
import { AjusteInventarioDatosGenerales } from "../components/crear/AjusteInventarioDatosGenerales";

export function AjusteInventarioCrearPage() {
  const { form, fields, tipoSeleccionado, resumen, enviando, funciones } = useAjusteInventarioCrear();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={funciones.cancelar}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nuevo Ajuste de Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Elige el tipo de ajuste y agrega los productos. El stock se actualiza al registrar.
          </p>
        </div>
      </div>

      <form onSubmit={funciones.onSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
          <AjusteInventarioDetalles
            form={form}
            fields={fields}
            tipoSeleccionado={tipoSeleccionado}
            onAgregar={funciones.agregarProducto}
            onEliminar={funciones.eliminarDetalle}
          />
          <AjusteInventarioDatosGenerales
            form={form}
            resumen={resumen}
            enviando={enviando}
            onCancelar={funciones.cancelar}
          />
        </div>
      </form>
    </div>
  );
}
