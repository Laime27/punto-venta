import type { ClienteType } from "@/features/cliente/types/ClienteType";
import type { UsuarioType } from "@/features/usuario/types/UsuarioType";
import type { MetodoPagoType } from "@/features/metodopago/types/MetodopagoType";
import type { ProductoType } from "@/features/producto/types/ProductoType";

export interface TipoComprobanteType {
  id: number;
  nombre: string;
  codigo_sunat: string;
  serie: string;
  correlativo?: string;
  activo?: boolean;
}

export interface ComprobantePagoType {
  id: number;
  comprobante_id: number;
  metodo_pago_id: number;
  monto: string | number;
  referencia?: string | null;
  metodo_pago?: MetodoPagoType;
}

export interface ComprobanteDetalleType {
  id: number;
  comprobante_id: number;
  producto_id: number;
  cantidad: string | number;
  precio_unitario: string | number;
  subtotal: string | number;
  producto?: ProductoType;
}

export interface ComprobanteCreditoType {
  id: number;
  comprobante_id: number;
  fecha: string;
  monto: string | number;
  saldo_pendiente: string | number;
  estado: "pendiente" | "pagado" | string;
  created_at?: string;
  updated_at?: string;
}

export interface ComprobanteType {
  id: number;
  codigo_venta: string;
  serie: string;
  correlativo: string;
  cliente_id?: number;
  tipo_comprobante_id?: number;
  subtotal: string | number;
  impuesto: string | number;
  descuento: string | number;
  total: string | number;
  estado: "pagado" | "pendiente" | "anulado" | string;
  forma_pago?: "contado" | "credito" | string;
  motivo_anulacion?: string | null;
  user_id?: number;
  caja_id?: number | null;
  created_at: string;
  fecha_emision: string;
  updated_at?: string;
  cliente?: ClienteType;
  tipo_comprobante?: TipoComprobanteType;
  user?: UsuarioType;
  caja?: {
    id: number;
    nombre?: string;
  } | null;
  pagos?: ComprobantePagoType[];
  detalles?: ComprobanteDetalleType[];
  creditos?: ComprobanteCreditoType[];
}

export interface FiltrosComprobanteType {
  search?: string;
  estado?: string | null;
  forma_pago?: "contado" | "credito" | "todos" | string | null;
  tipo_comprobante_id?: number | string | null;
  cliente_id?: number | null;
  user_id?: number | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  per_page?: number;
}

export interface AnularComprobantePayload {
  motivo_anulacion: string;
}

export interface PagoItemPayload {
  metodo_pago_id: number;
  monto: number;
}

export interface AbonarCreditoPayload {
  monto?: number;
  metodo_pago_id?: number;
  pagos?: PagoItemPayload[];
}

export interface ComprobanteMetricasType {
  total_ventas: number;
  total_comprobantes: number;
  total_contado: number;
  total_credito: number;
  total_pendiente_cobro: number;
  total_anulados: number;
  monto_anulado: number;
}

export interface ComprobanteListadoResponse {
  metricas: ComprobanteMetricasType;
  comprobantes: {
    data: ComprobanteType[];
    total: number;
    last_page: number;
  };
}

