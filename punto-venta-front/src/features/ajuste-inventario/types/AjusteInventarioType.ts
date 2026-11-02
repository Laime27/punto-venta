import type { UnidadType } from "@/features/unidad/types/UnidadType";

export type TipoAjusteId = 2 | 3 | 4;

export interface TipoAjusteType {
  id: TipoAjusteId;
  nombre: string;
  descripcion: string;
  etiquetaCantidad: string;
}

export interface AjusteInventarioProductoType {
  id: number;
  nombre: string;
  codigo_barras: string | null;
  unidad_id: number | null;
  unidad?: Pick<UnidadType, "id" | "nombre" | "abreviatura"> | null;
}

export interface AjusteInventarioDetalleType {
  id: number;
  ajuste_inventario_id: number;
  producto_id: number;
  cantidad: string;
  stock_anterior: string;
  stock_actual: string;
  diferencia: string;
  costo_unitario: string;
  producto?: AjusteInventarioProductoType;
}

export interface AjusteInventarioType {
  id: number;
  serie: string | null;
  correlativo: string | null;
  tipo_movimiento_id: TipoAjusteId;
  motivo: string | null;
  fecha_emision: string;
  user_id: number;
  detalles_count?: number;
  tipo_movimiento?: { id: number; nombre: string };
  user?: { id: number; name: string };
  detalles?: AjusteInventarioDetalleType[];
}

export interface AjusteInventarioPaginadoType {
  data: AjusteInventarioType[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface FiltrosAjusteInventario {
  tipo_movimiento_id: "todos" | `${TipoAjusteId}`;
  fecha_inicio: string;
  fecha_fin: string;
  search: string;
}

export interface AjusteInventarioCreatePayload {
  tipo_movimiento_id: TipoAjusteId;
  motivo?: string | null;
  detalles: {
    producto_id: number;
    cantidad: number;
  }[];
}

export interface ProductoAjusteResultado {
  id: number;
  nombre: string;
  stock: number | string;
  precio_compra?: number | string;
  codigo_barras?: string | null;
  imagen?: string | null;
  unidad?: { id: number; nombre: string; permite_decimales: boolean } | null;
}
