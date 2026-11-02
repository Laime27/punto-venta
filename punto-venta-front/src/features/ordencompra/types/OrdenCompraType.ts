import type { ProductoType } from "@/features/producto/types/ProductoType";
import { type ProveedorType } from "@/features/proveedor/types/ProveedorType";
import type { UsuarioType } from "@/features/usuario/types/UsuarioType";


export interface OrdenCompraDetalleType {
  id?: number;
  producto_id?: number;
  cantidad_pedida: number;
  precio_unitario: number;
  cantidad_recibida?: number;
  producto?: ProductoType
}



export interface OrdenCompraType {
  id: number;
  serie_id: number | null;
  serie: string | null;
  correlativo: string | null;
  proveedor_id: number | null;
  user_id: number | null;
  fecha_emision: string | null;
  fecha_recepcion: string | null;
  estado: string;
  total_estimado: number | null;
  total_real: number | null;
  observaciones: string | null;
  detalles: OrdenCompraDetalleType[];
  proveedor?: ProveedorType;
  usuario?: UsuarioType;
}

export interface OrdenCompraCreatePayload {
  proveedor_id?: number | null;
  fecha_emision?: string | null;
  fecha_recepcion?: string | null;
  observaciones?: string | null;
  detalles: {
    producto_id: number;
    cantidad_pedida: number;
    precio_unitario: number;
  }[];
}

export interface OrdenCompraRecibirPayload {
  detalles: {
    id: number;
    cantidad_recibida: number;
    precio_unitario?: number;
  }[];
}
