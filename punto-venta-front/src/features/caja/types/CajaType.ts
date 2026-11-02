import type { ComprobanteType } from "@/features/comprobante/types/ComprobanteType";

export type EstadoCaja = "abierta" | "cerrada" | "anulada";
export type TipoMovimientoCaja = "ingreso" | "egreso";

export interface UsuarioBasico {
  id: number;
  name: string;
}

export interface Caja {
  id: number;
  abierto_por: UsuarioBasico;
  cerrado_por: UsuarioBasico | null;
  fecha_apertura: string;
  fecha_cierre: string | null;
  monto_apertura: string;
  saldo_teorico: string | null;
  monto_real: string | null;
  diferencia: string | null;
  estado: EstadoCaja;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
}

export interface MovimientoCaja {
  id: number;
  caja_id: number;
  user_id: number;
  user?: UsuarioBasico;
  tipo: TipoMovimientoCaja;
  monto: string;
  motivo: string;
  observaciones: string | null;
  created_at: string;
}

export interface DesgloseMetodoPago {
  metodo_pago_id: number;
  nombre: string;
  tipo: string;
  total: number;
}

export interface CajaResumen {
  caja_id: number;
  estado: EstadoCaja;
  fecha_apertura: string;
  fecha_cierre: string | null;
  monto_apertura: number;
  ventas: {
    total: number;
    cantidad_comprobantes: number;
    contado: number;
    credito: number;
    efectivo: number;
    tarjeta: number;
    transferencia: number;
    desglose_metodos: DesgloseMetodoPago[];
  };
  cobros_credito: number;
  vuelto_entregado: number;
  movimientos: {
    total_ingresos: number;
    total_egresos: number;
    cantidad_ingresos: number;
    cantidad_egresos: number;
  };
  saldo_teorico: number;
  monto_real: number;
  diferencia: number;
}

export interface CajaDetalle extends Caja {
  movimientos: MovimientoCaja[];
  comprobantes: ComprobanteType[];
}

export interface CajaEstadoActual {
  activa: boolean;
  caja_id: number | null;
}

export interface CajaDetalleResponse {
  caja: CajaDetalle;
  resumen: CajaResumen;
}

export interface CajaMensajeResponse<T> {
  message: string;
  data: T;
}

export interface CajaCierreResultado {
  caja: Caja;
  resumen: CajaResumen;
}

export interface CajaPaginada {
  data: Caja[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export type FiltroEstadoCaja = EstadoCaja | "todos";
export type FiltroTipoMovimiento = TipoMovimientoCaja | "todos";

export interface FiltrosCaja {
  estado: FiltroEstadoCaja;
  fecha_inicio: string;
  fecha_fin: string;
  per_page: number;
}

export interface AbrirCajaPayload {
  monto_apertura: number;
  observaciones?: string;
}

export interface CerrarCajaPayload {
  monto_real: number;
  observaciones?: string;
}

export interface MovimientoCajaPayload {
  tipo: TipoMovimientoCaja;
  monto: number;
  motivo: string;
  observaciones?: string;
}
