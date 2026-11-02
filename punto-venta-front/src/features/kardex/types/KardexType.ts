export interface KardexProductoType {
  id: number;
  nombre: string;
  codigo_barras: string | null;
  stock: string;
  stock_minimo: string;
  precio_compra: string;
  precio_venta: string;
  deleted_at: string | null;
  unidad?: { id: number; nombre: string; abreviatura: string } | null;
  categoria?: { id: number; nombre: string } | null;
}

export interface KardexResumenType {
  saldo_inicial: number;
  entradas: number;
  salidas: number;
  saldo_final: number;
  stock_actual: number;
  valor_stock: number | null;
  total_movimientos: number;
}

export interface KardexMovimientoType {
  id: number;
  operacion: "+" | "-";
  cantidad: string;
  stock_anterior: string;
  stock_actual: string;
  observacion: string | null;
  fecha_emision: string | null;
  nombre_documento: string;
  tipo_movimiento?: { id: number; nombre: string };
  user?: { id: number; name: string };
  documento?: { id: number; serie?: string; correlativo?: string } | null;
}

export interface KardexMovimientosPaginadoType {
  data: KardexMovimientoType[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface KardexRespuestaType {
  producto: KardexProductoType;
  resumen: KardexResumenType;
  movimientos: KardexMovimientosPaginadoType;
}

export interface FiltrosKardexType {
  fecha_inicio: string;
  fecha_fin: string;
}
