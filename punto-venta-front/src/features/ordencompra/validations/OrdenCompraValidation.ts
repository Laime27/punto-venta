import { z } from "zod";

export const ordenCompraCreateSchema = z.object({
  proveedor_id: z.number().nullable().optional(),
  fecha_emision: z.string().nullable().optional(),
  fecha_recepcion: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  detalles: z.array(
    z.object({
      producto_id: z.number().min(1, "El producto es obligatorio"),
      cantidad_pedida: z.number().min(1, "La cantidad debe ser mayor a 0"),
      precio_unitario: z.number().min(0, "El precio no puede ser negativo"),
    })
  ).min(1, "Debe agregar al menos un producto"),
});

export const ordenCompraRecibirSchema = z.object({
  detalles: z.array(
    z.object({
      id: z.number().min(1, "El ID del detalle es obligatorio"),
      cantidad_recibida: z.number({ message: "Ingresa la cantidad recibida" }).min(0, "La cantidad no puede ser negativa"),
      precio_unitario: z.number().min(0, "El precio no puede ser negativo").optional(),
    })
  ).min(1, "Los detalles son obligatorios"),
});
