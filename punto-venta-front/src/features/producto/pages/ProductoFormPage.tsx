import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useProductoFormHook } from "../hooks/ProductoFormHook"
import { ProductoInfoBasicaForm } from "../components/form/ProductoInfoBasicaForm"
import { ProductoPreciosForm } from "../components/form/ProductoPreciosForm"
import { ProductoInventarioForm } from "../components/form/ProductoInventarioForm"
import { ProductoClasificacionForm } from "../components/form/ProductoClasificacionForm"
import { ProductoImagenEstadoForm } from "../components/form/ProductoImagenEstadoForm"

export function ProductoFormPage() {
  const {
    form,
    onSubmit,
    guardando,
    cargandoProducto,
    Edicion,
    codigo,
    imagen,
    selects,
  } = useProductoFormHook()

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <ProductoInfoBasicaForm form={form} codigo={codigo} />
            <ProductoPreciosForm form={form} />
            <ProductoInventarioForm form={form} />
          </div>

          <div className="space-y-6">
            <ProductoClasificacionForm form={form} selects={selects} />
            <ProductoImagenEstadoForm form={form} imagen={imagen} />
          </div>
        </div>

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
