import type { UseFormReturn } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductoFormValues } from "../../validations/ProductoValidation"

interface ProductoInventarioFormProps {
  form: UseFormReturn<ProductoFormValues>
}

export function ProductoInventarioForm({ form }: ProductoInventarioFormProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Inventario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="stock">Stock actual</Label>
            <Input
              id="stock"
              type="number"
              step="0.01"
              {...register("stock")}
            />
            {errors.stock && (
              <p className="text-xs text-destructive">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock_minimo">Stock mínimo</Label>
            <Input
              id="stock_minimo"
              type="number"
              step="0.01"
              {...register("stock_minimo")}
            />
            {errors.stock_minimo && (
              <p className="text-xs text-destructive">
                {errors.stock_minimo.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
