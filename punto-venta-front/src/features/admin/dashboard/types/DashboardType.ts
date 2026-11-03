export interface IndicadoresVentasType {
  total_ventas: number;
  cantidad_ventas: number;
  utilidad_bruta: number;
  margen: number;
}

export interface CajaDashboardType {
  abierta: boolean;
  id?: number;
  abierto_por?: string | null;
  fecha_apertura?: string;
  saldo_teorico?: number;
}

export interface StockBajoType {
  id: number;
  nombre: string;
  codigo_barras: string | null;
  stock: number;
  stock_minimo: number;
}

export interface UltimaVentaType {
  id: number;
  documento: string;
  cliente: string | null;
  total: number;
  forma_pago: string;
  fecha: string;
}

export interface DashboardType {
  hoy: IndicadoresVentasType;
  ayer: IndicadoresVentasType;
  mes: IndicadoresVentasType;
  por_cobrar: { total: number; vencido: number; clientes_con_vencidos: number };
  inventario: { valor_costo: number; stock_bajo: number; por_agotarse: number };
  caja: CajaDashboardType;
  evolucion: { fecha: string; total: number; cantidad: number }[];
  metodos_pago: { id: number; nombre: string; total: number }[];
  mas_vendidos: { id: number; nombre: string; cantidad: number }[];
  stock_bajo: StockBajoType[];
  ultimas_ventas: UltimaVentaType[];
}
