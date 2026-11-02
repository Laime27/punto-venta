import { Controller, type UseFormReturn } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SubirImagen } from "@/components/ImageUpload"
import type { ProductoFormValues } from "../../validations/ProductoValidation"
import type { useProductoFormHook } from "../../hooks/ProductoFormHook"

interface ProductoImagenEstadoFormProps {
  form: UseFormReturn<ProductoFormValues>
  imagen: ReturnType<typeof useProductoFormHook>["imagen"]
}

export function ProductoImagenEstadoForm({
  form,
  imagen,
}: ProductoImagenEstadoFormProps) {
  const { control } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Imagen y estado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-6 sm:grid-cols-2 items-start">
          <div className="space-y-2">
            <Label>Imagen del producto</Label>
            <SubirImagen
              vistaPrevia={imagen.vistaPrevia}
              alCambiar={imagen.manejarCambioImagen}
              alEliminar={imagen.eliminarImagen}
              textoAlternativo="Click para subir foto"
            />
          </div>

          <div className="space-y-2">
            <Label>Disponibilidad</Label>
            <div className="rounded-lg border p-3.5 bg-muted/20">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Disponible para venta</p>
                  <p className="text-xs text-muted-foreground">
                    Habilita este producto en el punto de venta
                  </p>
                </div>
                <Controller
                  control={control}
                  name="disponible_venta"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
