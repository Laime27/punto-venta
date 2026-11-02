import type { UseFormReturn } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductoFormValues } from "../../validations/ProductoValidation"
import { Puede } from "@/features/auth/components/Puede"

interface ProductoPreciosFormProps {
  form: UseFormReturn<ProductoFormValues>
}

export function ProductoPreciosForm({ form }: ProductoPreciosFormProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Precios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Puede permiso="producto.ver_costo">
            <div className="space-y-2">
              <Label htmlFor="precio_compra">Precio compra</Label>
              <Input
                id="precio_compra"
                type="number"
                min={0}
                step="0.01"
                {...register("precio_compra")}
              />
              {errors.precio_compra && (
                <p className="text-xs text-destructive">
                  {errors.precio_compra.message}
                </p>
              )}
            </div>
          </Puede>

          <div className="space-y-2">
            <Label htmlFor="precio_venta" isRequired>
              Precio venta
            </Label>
            <Input
              id="precio_venta"
              type="number"
              min={0}
              step="0.01"
              {...register("precio_venta")}
            />
            {errors.precio_venta && (
              <p className="text-xs text-destructive">
                {errors.precio_venta.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio_mayoreo">Precio mayoreo</Label>
            <Input
              id="precio_mayoreo"
              type="number"
              min={0}
              step="0.01"
              {...register("precio_mayoreo")}
            />
            {errors.precio_mayoreo && (
              <p className="text-xs text-destructive">
                {errors.precio_mayoreo.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
