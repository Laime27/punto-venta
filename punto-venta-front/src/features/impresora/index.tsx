import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImpresoraSkeleton } from "./components/ImpresoraSkeleton";
import { ImpresoraEstadoAgente } from "./components/ImpresoraEstadoAgente";
import { ImpresoraForm } from "./components/ImpresoraForm";
import { ImpresoraFormActions } from "./components/ImpresoraFormActions";
import { useImpresoraFormHook } from "./hooks/useImpresoraFormHook";

export default function Impresora() {
  const { form, onSubmit, cargando, guardando, hayCambios, cancelar, seleccionarAncho, impresoras, agente, prueba } =
    useImpresoraFormHook();

  return (
    <div className="p-6">
      {cargando ? (
        <ImpresoraSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Configuración de impresora</CardTitle>
              <CardDescription>Impresora de tickets de esta PC y el ancho del papel que usa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImpresoraEstadoAgente
                conectado={agente.conectado}
                verificando={agente.verificando}
                onReintentar={impresoras.refrescar}
              />
              <ImpresoraForm
                form={form}
                opciones={impresoras.opciones}
                refrescando={agente.verificando}
                onRefrescar={impresoras.refrescar}
                onSeleccionarAncho={seleccionarAncho}
              />
            </CardContent>
            <CardFooter className="border-t pt-6">
              <ImpresoraFormActions
                hayCambios={hayCambios}
                guardando={guardando}
                imprimiendo={prueba.imprimiendo}
                puedeImprimir={prueba.puedeImprimir}
                onCancelar={cancelar}
                onImprimirPrueba={prueba.imprimir}
              />
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
