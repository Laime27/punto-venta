import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmpresaSkeleton } from "./components/EmpresaSkeleton";
import { EmpresaLogoUpload } from "./components/EmpresaLogoUpload";
import { EmpresaForm } from "./components/EmpresaForm";
import { EmpresaFormActions } from "./components/EmpresaFormActions";
import { useEmpresaFormHook } from "./hooks/useEmpresaFormHook";

export default function Empresa() {
  const { form, onSubmit, cargando, guardando, hayCambios, cancelar, zonasHorarias, cargandoZonas, logo } = useEmpresaFormHook();

  return (
    <div className="p-6">
      {cargando ? (
        <EmpresaSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Configuración de empresa</CardTitle>
              <CardDescription>Datos que se muestran en comprobantes, tickets y en todo el sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-[220px_1fr]">
                <EmpresaLogoUpload
                  vistaPrevia={logo.vistaPrevia}
                  error={logo.error}
                  deshabilitado={guardando}
                  onCambiar={logo.cambiar}
                  onQuitar={logo.eliminar}
                />
                <EmpresaForm form={form} zonasHorarias={zonasHorarias} cargandoZonas={cargandoZonas} />
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t pt-6">
              <EmpresaFormActions hayCambios={hayCambios} guardando={guardando} onCancelar={cancelar} />
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
