import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import type { UseFormRegister, FieldErrors, FieldArrayWithId } from "react-hook-form";
import type { OrdenCompraType, OrdenCompraRecibirPayload } from "../../types/OrdenCompraType";

interface Props {
  fields: FieldArrayWithId<OrdenCompraRecibirPayload, "detalles", "id">[];
  formErrors: FieldErrors<OrdenCompraRecibirPayload>;
  register: UseFormRegister<OrdenCompraRecibirPayload>;
  ordenCompra: OrdenCompraType;
}

export function OrdenCompraRecibirForm({
  fields,
  formErrors,
  register,
  ordenCompra,
}: Props) {
  const { simbolo } = useMonedaHook();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Productos a Recibir</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Ingresa la cantidad <strong>total recibida hasta ahora</strong> por línea.
          </p>
        </CardHeader>
        <CardContent>
          {fields.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No hay productos en esta orden.
            </div>
          )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const detalleOriginal = ordenCompra?.detalles?.[index];
            return (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 border rounded-lg bg-muted/30"
              >
                <div className="space-y-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    Producto: {detalleOriginal?.producto?.nombre ?? ""}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Pedido: <strong>{detalleOriginal?.cantidad_pedida ?? 0}</strong></span>
                    <span>Ya recibido: <strong>{detalleOriginal?.cantidad_recibida ?? 0}</strong></span>
                    <span>Pendiente: <strong>{(detalleOriginal?.cantidad_pedida ?? 0) - (detalleOriginal?.cantidad_recibida ?? 0)}</strong></span>
                  </div>
                </div>

                <div className="space-y-1 w-36">
                  <Label className="text-xs">Cantidad Recibida (Total)</Label>
                  <Input
                    type="number"
                    min={0}
                    {...register(`detalles.${index}.cantidad_recibida`, { valueAsNumber: true })}
                    onFocus={(e) => e.target.select()}
                  />
                  {formErrors.detalles?.[index]?.cantidad_recibida && (
                    <p className="text-xs text-red-500">
                      {formErrors.detalles[index]?.cantidad_recibida?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 w-32">
                  <Label className="text-xs text-muted-foreground">Precio U. Final</Label>
                  <p className="text-sm font-medium pt-2">
                    {simbolo} {Number(detalleOriginal?.precio_unitario ?? 0).toFixed(2)}
                  </p>
                  <input type="hidden" {...register(`detalles.${index}.precio_unitario`, { valueAsNumber: true })} value={detalleOriginal?.precio_unitario ?? 0} />
                </div>

                <input type="hidden" {...register(`detalles.${index}.id`, { valueAsNumber: true })} />
              </div>
            );
          })}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
