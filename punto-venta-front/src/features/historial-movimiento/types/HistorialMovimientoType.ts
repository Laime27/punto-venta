import type { ProductoType } from "@/features/producto/types/ProductoType";
import type { UsuarioType } from "@/features/usuario/types/UsuarioType";

export interface TipoMovimientoType {
  id: number;
  nombre: string;
}

export interface DocumentoType {
  id: number;
  serie?: string;
  correlativo?: string;
}

export interface HistorialMovimientoType {
  id: number;
  producto_id: number;
  user_id: number;
  tipo_movimiento_id: number;
  documento_id?: number | null;
  documento_type?: string | null;
  operacion: string;
  cantidad: number;
  stock_anterior: number;
  stock_actual: number;
  observacion?: string | null;
  producto?: ProductoType;
  user?: UsuarioType;
  tipo_movimiento?: TipoMovimientoType;
  documento?: DocumentoType;
  fecha_emision: string;
  nombre_documento: string;
}

export type FiltroOperacion = "todos" | "+" | "-";

export interface FiltrosHistorialType {
  per_page: number;
  search: string;
  tipo_movimiento_id: string;
  operacion: FiltroOperacion;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface HistorialPaginadoType {
  data: HistorialMovimientoType[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface HistorialRespuestaType {
  status: string;
  data: HistorialPaginadoType;
}
