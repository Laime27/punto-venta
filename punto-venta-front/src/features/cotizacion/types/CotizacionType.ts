import type { ProductoType } from "@/features/producto/types/ProductoType";
import type { ClienteType } from "@/features/cliente/types/ClienteType";
import type { UsuarioType } from "@/features/usuario/types/UsuarioType";

export interface CotizacionDetalleType {
  id?: number;
  producto_id?: number;
  cantidad: number;
  precio_unitario: number;
  descuento_unitario?: number;
  subtotal?: number;
  producto?: ProductoType;
}

export interface CotizacionType {
  id: number;
  serie: string | null;
  correlativo: string | null;
  cliente_id: number | null;
  user_id: number | null;
  fecha_emision: string | null;
  fecha_vencimiento: string | null;
  estado: string;
  motivo_rechazo: string | null;
  subtotal: number;
  descuento: number;
  porcentaje_impuesto: number;
  monto_impuesto: number;
  total: number;
  observaciones: string | null;
  detalles: CotizacionDetalleType[];
  cliente?: ClienteType;
  usuario?: UsuarioType;
  // Venta generada desde esta cotización (null si no se convirtió o si esa venta se anuló)
  comprobante_id?: number | null;
  comprobante?: { id: number; serie: string; correlativo: string } | null;
}

export interface CotizacionPayload {
  cliente_id?: number | null;
  fecha_emision?: string | null;
  fecha_vencimiento?: string | null;
  estado?: string;
  observaciones?: string | null;
  descuento?: number;
  porcentaje_impuesto?: number;
  detalles: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    descuento_unitario?: number;
  }[];
}

export interface FiltrosCotizacionType {
  search: string;
  estado: string;
  cliente_id: number | null;
  fecha_inicio: string;
  fecha_fin: string;
}
