import { PackageOpen } from "lucide-react";
import { useWatch, type FieldArrayWithId, type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AjusteInventarioBuscadorProducto } from "./AjusteInventarioBuscadorProducto";
import { AjusteInventarioDetalleFila } from "./AjusteInventarioDetalleFila";
import type { AjusteInventarioFormValues } from "../../validations/AjusteInventarioValidation";
import type { ProductoAjusteResultado, TipoAjusteType } from "../../types/AjusteInventarioType";

interface Props {
  form: UseFormReturn<AjusteInventarioFormValues>;
  fields: FieldArrayWithId<AjusteInventarioFormValues, "detalles", "id">[];
  tipoSeleccionado: TipoAjusteType;
  onAgregar: (producto: ProductoAjusteResultado) => void;
  onEliminar: (index: number) => void;
}

export function AjusteInventarioDetalles({ form, fields, tipoSeleccionado, onAgregar, onEliminar }: Props) {
  const detalles = useWatch({ control: form.control, name: "detalles" }) ?? [];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Productos a ajustar</CardTitle>
        <p className="text-sm text-muted-foreground">{tipoSeleccionado.descripcion}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AjusteInventarioBuscadorProducto onAgregar={onAgregar} />

        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-[1fr_90px_130px_90px_90px_40px] gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold uppercase text-muted-foreground border-b">
            <div>Producto</div>
            <div className="text-center">Stock actual</div>
            <div className="text-center">{tipoSeleccionado.etiquetaCantidad}</div>
            <div className="text-center">Stock nuevo</div>
            <div className="text-center">Diferencia</div>
            <div />
          </div>

          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <PackageOpen className="h-12 w-12 opacity-30" />
              <p className="text-sm">Busca un producto arriba para agregarlo al ajuste</p>
            </div>
          ) : (
            <div className="divide-y">
              {fields.map((field, index) => (
                <AjusteInventarioDetalleFila
                  key={field.id}
                  form={form}
                  index={index}
                  detalle={detalles[index] ?? field}
                  tipo={tipoSeleccionado.id}
                  onEliminar={() => onEliminar(index)}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
