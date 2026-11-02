import { z } from "zod";
import type { TipoAjusteType } from "../types/AjusteInventarioType";

export const TIPO_RECUENTO = 2;
export const TIPO_PERDIDA = 3;
export const TIPO_DANO = 4;

export const TIPOS_AJUSTE: TipoAjusteType[] = [
  {
    id: TIPO_RECUENTO,
    nombre: "Recuento de inventario",
    descripcion: "Ingresa lo que contaste físicamente; el stock quedará en esa cantidad.",
    etiquetaCantidad: "Stock contado",
  },
  {
    id: TIPO_PERDIDA,
    nombre: "Pérdida",
    descripcion: "Ingresa las unidades perdidas; se descontarán del stock.",
    etiquetaCantidad: "Cantidad perdida",
  },
  {
    id: TIPO_DANO,
    nombre: "Daño",
    descripcion: "Ingresa las unidades dañadas; se descontarán del stock.",
    etiquetaCantidad: "Cantidad dañada",
  },
];

const detalleSchema = z.object({
  producto_id: z.number().min(1, "El producto es obligatorio"),
  nombre: z.string(),
  codigo_barras: z.string().nullable(),
  stock: z.number(),
  precio_compra: z.number(),
  permite_decimales: z.boolean(),
  cantidad: z.number({ error: "Ingresa una cantidad válida" }).min(0, "La cantidad no puede ser negativa"),
});

export const ajusteInventarioSchema = z
  .object({
    tipo_movimiento_id: z.literal([TIPO_RECUENTO, TIPO_PERDIDA, TIPO_DANO], { error: "Selecciona el tipo de ajuste" }),
    motivo: z.string().max(500, "El motivo no debe superar los 500 caracteres").optional(),
    detalles: z.array(detalleSchema).min(1, "Debe agregar al menos un producto"),
  })
  .superRefine((valores, ctx) => {
    const descuentaStock = valores.tipo_movimiento_id !== TIPO_RECUENTO;

    valores.detalles.forEach((detalle, index) => {
      const path = ["detalles", index, "cantidad"];

      if (!detalle.permite_decimales && !Number.isInteger(detalle.cantidad)) {
        ctx.addIssue({ code: "custom", path, message: "Este producto no permite decimales" });
      } else if (descuentaStock && detalle.cantidad <= 0) {
        ctx.addIssue({ code: "custom", path, message: "Debe ser mayor a 0" });
      } else if (descuentaStock && detalle.cantidad > detalle.stock) {
        ctx.addIssue({ code: "custom", path, message: `Supera el stock (${detalle.stock})` });
      }
    });
  });

export type AjusteInventarioFormValues = z.infer<typeof ajusteInventarioSchema>;
export type AjusteInventarioDetalleFormValues = z.infer<typeof detalleSchema>;
