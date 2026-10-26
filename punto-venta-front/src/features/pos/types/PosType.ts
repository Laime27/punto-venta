import { type MetodoPagoType } from "@/features/metodopago/types/MetodopagoType";
import { type UnidadType } from "@/features/unidad/types/UnidadType";
import { type ClienteType } from "@/features/cliente/types/ClienteType";

export interface PosType {
  id: number;
  createdAt: string;
}

export interface ProductoBuscadoType {
  id: number
  nombre: string
  precio_venta: string | number
  precio_mayoreo: string | number
  stock: number
  codigo_barras: string
  unidad_id: number
  unidad: UnidadType
  imagen: string
}


export interface ProductoCarritoType extends ProductoBuscadoType {
  cantidad: number
  subtotal: number
  precio_usado: number
  es_mayoreo: boolean
  // Viene de una cotización: el precio queda fijo
  es_cotizado?: boolean
}

export interface CuotaType {
  fecha: string;
  monto: string | number;
}

export interface PagoAgregado {
  id: string;
  metodo: MetodoPagoType;
  monto: number;
}

export interface CotizacionOrigenType {
  id: number;
  serie: string | null;
  correlativo: string | null;
  total: number | string;
}

// Respuesta de GET /cotizacion/{id}/para-venta: productos con el precio cotizado, listos para el carrito
export interface CotizacionParaVentaType {
  cotizacion: CotizacionOrigenType;
  cliente: ClienteType | null;
  descuento: number;
  items: {
    producto: ProductoBuscadoType;
    cantidad: number;
    precio: number;
  }[];
}
