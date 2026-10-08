import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Link } from "react-router-dom"
import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProductoFormHook } from "../hooks/ProductoFormHook"
import { type UnidadType } from "@/features/unidad/types/UnidadType"
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
import { Textarea } from "@/components/ui/textarea"
import { SubirImagen } from "@/components/ImageUpload"

export function ProductoFormPage() {
  const {
    form,
    onSubmit,
    guardando,
    cargandoProducto,
    Edicion,
    imagen,
    selects,
  } = useProductoFormHook()

  const {
    register,
    control,
    formState: { errors },
  } = form

  if (cargandoProducto) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/producto">
          <Button variant="ghost" size="icon" type="button">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {Edicion ? "Editar producto" : "Nuevo producto"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {Edicion
              ? "Actualiza los datos del producto"
              : "Completa los datos para crear el producto"}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre" isRequired>
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  placeholder="Nombre del producto"
                  {...register("nombre")}
                />
                {errors.nombre && (
                  <p className="text-xs text-destructive">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo_barras">Código de barras</Label>
                <Input
                  id="codigo_barras"
                  placeholder="Código de barras"
                  {...register("codigo_barras")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción del producto (opcional)"
                {...register("descripcion")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Precios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clasificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="categoria_id" isRequired>Categoría</Label>
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
                <span>
                  {errors.categoria_id && (
                    <p className="text-xs text-destructive">
                      {errors.categoria_id.message}
                    </p>
                  )}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidad_id" isRequired>Unidad</Label>
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
                <span>
                  {errors.unidad_id && (
                    <p className="text-xs text-destructive">
                      {errors.unidad_id.message}
                    </p>
                  )}
                </span>
              </div>

              <div className="space-y-2">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Imagen y estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
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
                <Label>Disponible para venta</Label>
                <label className="flex cursor-pointer items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    {...register("disponible_venta")}
                  />
                  <span className="text-sm text-muted-foreground">
                    El producto está disponible para venta
                  </span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mb-8">
          <Link
            to="/producto"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={guardando} className="gap-2">
            {guardando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {guardando
              ? "Guardando..."
              : Edicion
                ? "Actualizar"
                : "Crear producto"}
          </Button>
        </div>
      </form>
    </div>
  )
}
