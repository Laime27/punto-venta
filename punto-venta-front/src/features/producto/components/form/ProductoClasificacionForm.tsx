import { Controller, type UseFormReturn } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchableSelect } from "@/components/SearchableSelect"
import { MultiSearchableSelect } from "@/components/MultiSearchableSelect"
import type { UnidadType } from "@/features/unidad/types/UnidadType"
import type { ProductoFormValues } from "../../validations/ProductoValidation"
import type { useProductoFormHook } from "../../hooks/ProductoFormHook"

interface ProductoClasificacionFormProps {
  form: UseFormReturn<ProductoFormValues>
  selects: ReturnType<typeof useProductoFormHook>["selects"]
}

export function ProductoClasificacionForm({
  form,
  selects,
}: ProductoClasificacionFormProps) {
  const {
    control,
    formState: { errors },
  } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Clasificación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="categoria_id" isRequired>
              Categoría
            </Label>
            <Controller
              control={control}
              name="categoria_id"
              render={({ field }) => (
                <SearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  queryKey="categorias-select-search"
                  fetchFn={selects.listarSelectCategoria}
                  placeholder="— Sin categoría —"
                  searchPlaceholder="Buscar categoría..."
                  initialOption={selects.initialCategoria}
                />
              )}
            />
            {errors.categoria_id && (
              <p className="text-xs text-destructive">
                {errors.categoria_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidad_id" isRequired>
              Unidad
            </Label>
            <Controller
              control={control}
              name="unidad_id"
              render={({ field }) => (
                <Select
                  key={`unidad-${field.value}-${selects.unidades?.length}`}
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : null)
                  }
                  value={field.value ? String(field.value) : ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="— Sin unidad —" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {selects.unidades?.map((unidad: UnidadType) => (
                        <SelectItem key={unidad.id} value={String(unidad.id)}>
                          {unidad.nombre} ({unidad.abreviatura})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unidad_id && (
              <p className="text-xs text-destructive">
                {errors.unidad_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="proveedores">Proveedores</Label>
            <Controller
              control={control}
              name="proveedores"
              render={({ field }) => (
                <MultiSearchableSelect
                  value={field.value}
                  onChange={field.onChange}
                  queryKey="proveedores-select-search"
                  fetchFn={selects.listarSelectProveedor}
                  placeholder="— Sin proveedores —"
                  searchPlaceholder="Buscar proveedor..."
                  initialOptions={selects.initialProveedores}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
