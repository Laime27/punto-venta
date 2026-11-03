import { z } from "zod"
import type { UnidadType } from "@/features/unidad/types/UnidadType"

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().nullable().optional(),
  precio_compra: z.coerce.number().min(0, "Debe ser 0 o mayor"),
  precio_venta: z.coerce
    .number()
    .min(0.01, "El precio de venta debe ser mayor a 0"),
  precio_mayoreo: z.coerce.number().min(0, "Debe ser 0 o mayor"),
  stock: z.coerce.number().min(0, "Debe ser 0 o mayor"),
  stock_minimo: z.coerce.number().min(0, "Debe ser 0 o mayor"),
  codigo_barras: z.string().nullable().optional(),
  categoria_id: z.coerce.number().min(1, "Debes seleccionar una categoria"),
  unidad_id: z.coerce.number().min(1, "Debes seleccionar una unidad"),
  proveedores: z.array(z.number()).default([]),
  disponible_venta: z.boolean().default(true),
})

export const crearProductoSchema = (unidades: UnidadType[]) =>
  productoSchema.superRefine(({ precio_compra, precio_venta, stock, unidad_id }, contexto) => {
    if (precio_venta < precio_compra) {
      contexto.addIssue({
        code: "custom",
        path: ["precio_venta"],
        message: "El precio de venta no puede ser menor al precio de costo",
      })
    }

    const unidad = unidades.find(({ id }) => id === unidad_id)
    if (unidad && !unidad.permite_decimales && !Number.isInteger(stock)) {
      contexto.addIssue({
        code: "custom",
        path: ["stock"],
        message: `La unidad ${unidad.nombre} no permite stock con decimales`,
      })
    }
  })

export type ProductoFormValues = z.infer<typeof productoSchema>
