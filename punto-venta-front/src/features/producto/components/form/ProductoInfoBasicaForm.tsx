import type { UseFormReturn } from "react-hook-form"
import { Loader2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProductoFormValues } from "../../validations/ProductoValidation"

interface ProductoInfoBasicaFormProps {
  form: UseFormReturn<ProductoFormValues>
  codigo: {
    generar: () => void
    generando: boolean
  }
}

export function ProductoInfoBasicaForm({ form, codigo }: ProductoInfoBasicaFormProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
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
            <div className="flex gap-2">
              <Input
                id="codigo_barras"
                placeholder="Escanea o escribe el código"
                {...register("codigo_barras")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={codigo.generar}
                disabled={codigo.generando}
                className="gap-1.5 shrink-0"
                title="Generar código interno"
              >
                {codigo.generando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Generar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Si lo dejas vacío, se generará uno automáticamente al guardar.
            </p>
            {errors.codigo_barras && (
              <p className="text-xs text-destructive">
                {errors.codigo_barras.message}
              </p>
            )}
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
  )
}
