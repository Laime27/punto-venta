import { z } from "zod"

// Mismas reglas que ProductoImport.php para marcar los errores antes de enviar
const numeroOpcional = (campo: string) =>
  z
    .string()
    .trim()
    .refine((valor) => valor === "" || !Number.isNaN(Number(valor)), `El ${campo} debe ser un número válido.`)
    .refine((valor) => valor === "" || Number(valor) >= 0, `El ${campo} no puede ser negativo.`)

export const filaImportacionSchema = z.object({
  fila: z.number(),
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre del producto es obligatorio.")
    .max(255, "El nombre no debe superar los 255 caracteres."),
  descripcion: z.string(),
  precio_compra: numeroOpcional("precio de compra"),
  precio_venta: numeroOpcional("precio de venta").refine(
    (valor) => valor !== "",
    "El precio de venta es obligatorio."
  ),
  precio_mayoreo: numeroOpcional("precio de mayoreo"),
  stock: numeroOpcional("stock"),
  stock_minimo: numeroOpcional("stock mínimo"),
  codigo_barras: z.string(),
  categoria: z.string().max(255, "La categoría no debe superar los 255 caracteres."),
  unidad: z.string().max(255, "La unidad no debe superar los 255 caracteres."),
  disponible_venta: z.string(),
})

export const importacionFilasSchema = z.object({
  filas: z.array(filaImportacionSchema).min(1, "Debe haber al menos un producto para importar."),
})

export type FilaImportacionFormValues = z.infer<typeof filaImportacionSchema>
export type ImportacionFilasFormValues = z.infer<typeof importacionFilasSchema>
