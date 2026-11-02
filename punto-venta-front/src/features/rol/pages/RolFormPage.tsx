import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SinAcceso } from "@/features/auth/components/SinAcceso";
import { useRolFormulario } from "../hooks/useRolFormulario";
import { RolFormulario } from "../components/RolFormulario";

export function RolFormPage() {
  const { form, grupos, esEdicion, esAdministrador, cargando, guardando, seleccion, funciones } = useRolFormulario();

  if (cargando) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (esAdministrador) return <SinAcceso />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={funciones.cancelar}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{esEdicion ? "Editar rol" : "Nuevo rol"}</h1>
          <p className="text-sm text-muted-foreground">Marca un grupo completo o elige permisos individuales.</p>
        </div>
      </div>

      <RolFormulario
        form={form}
        grupos={grupos}
        guardando={guardando}
        esEdicion={esEdicion}
        seleccion={seleccion}
        onSubmit={funciones.onSubmit}
        onCancelar={funciones.cancelar}
      />
    </div>
  );
}
