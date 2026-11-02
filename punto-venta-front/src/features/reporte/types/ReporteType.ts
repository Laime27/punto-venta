import type { ReactNode } from "react";
import type { EstadoStock } from "@/lib/stock";

export type ReporteId = "ventas" | "productos" | "cuentas-por-cobrar" | "inventario" | "perdidas";

export type FormatoExportacion = "pdf" | "excel";

export type PeriodoId = "hoy" | "7dias" | "mes" | "mes-anterior" | "anio";

export interface FiltrosDisponibles {
  fechas?: boolean;
  vendedor?: boolean;
  categoria?: boolean;
  producto?: boolean;
  cliente?: boolean;
  stockBajo?: boolean;
}

export interface FiltrosReporteType {
  fecha_inicio: string;
  fecha_fin: string;
  user_id: number | null;
  categoria_id: number | null;
  producto_id: number | null;
  cliente_id: number | null;
  solo_stock_bajo: boolean;
}

export interface OpcionSelect {
  id: number;
  nombre: string;
}

export interface PaginadoType<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginacionTabla {
  pagina: number;
  totalPaginas: number;
  total: number;
  porPagina: number;
  opcionesPorPagina: number[];
  cambiarPagina: (pagina: number) => void;
  cambiarPorPagina: (porPagina: number) => void;
}

export interface IndicadorReporte {
  titulo: string;
  valor: string;
  detalle?: string;
  tono?: "neutro" | "positivo" | "negativo" | "alerta";
}

export interface ColumnaReporte<T> {
  titulo: string;
  celda: (fila: T) => ReactNode;
  alinear?: "left" | "right" | "center";
}

export type SegmentoGrafico = {
  clave: string;
  nombre: string;
  valor: number;
};

export interface ProductoRentabilidadType {
  id: number;
  nombre: string;
  codigo_barras: string | null;
  categoria: string;
  cantidad: number;
  ingresos: number;
  costo: number;
  utilidad: number;
  margen: number;
}

export interface ProductoUnidadesType {
  id: number;
  nombre: string;
  cantidad: number;
}

export interface ParticipacionType {
  id: number | null;
  nombre: string;
  total: number;
  participacion: number;
}

export interface ReporteVentasType {
  indicadores: {
    total_ventas: number;
    cantidad_ventas: number;
    total_descuentos: number;
    total_contado: number;
    total_credito: number;
    costo_ventas: number;
    utilidad_bruta: number;
    margen: number;
    cantidad_anuladas: number;
    monto_anulado: number;
  };
  agrupacion: "dia" | "mes";
  periodos: { periodo: string; cantidad: number; total: number }[];
  metodos_pago: (ParticipacionType & { operaciones: number })[];
  categorias: (ParticipacionType & { cantidad: number })[];
  mas_vendidos: ProductoUnidadesType[];
  menos_vendidos: ProductoUnidadesType[];
}

export interface ReporteProductosType {
  indicadores: {
    productos_vendidos: number;
    unidades_vendidas: number;
    ingresos: number;
    costo: number;
    utilidad: number;
    margen: number;
  };
  mayores_ingresos: ProductoRentabilidadType[];
  mayor_utilidad: ProductoRentabilidadType[];
}

export interface CuentaPorCobrarType {
  id: number;
  cliente: string;
  telefono: string | null;
  ventas: number;
  cuotas_pendientes: number;
  saldo: number;
  saldo_vencido: number;
  saldo_por_vencer: number;
  vencimiento_mas_antiguo: string;
}

export interface ReporteCuentasPorCobrarType {
  indicadores: {
    total_por_cobrar: number;
    total_vencido: number;
    total_por_vencer: number;
    clientes_con_deuda: number;
    clientes_con_vencidos: number;
  };
  mayores_deudores: CuentaPorCobrarType[];
}

export interface InventarioProductoType {
  id: number;
  nombre: string;
  codigo_barras: string | null;
  categoria: string;
  stock: number;
  stock_minimo: number;
  precio_compra: number;
  precio_venta: number;
  valor_costo: number;
  valor_venta: number;
  estado_stock: EstadoStock;
}

export interface ReporteInventarioType {
  indicadores: {
    total_productos: number;
    total_unidades: number;
    valor_costo: number;
    valor_venta: number;
    utilidad_potencial: number;
    productos_stock_bajo: number;
    productos_por_agotarse: number;
  };
  por_categoria: { id: number | null; nombre: string; productos: number; valor_costo: number; valor_venta: number }[];
  mayor_inversion: InventarioProductoType[];
}

export interface PerdidaTipoType {
  id: number;
  tipo: string;
  ajustes: number;
  unidades: number;
  valor: number;
}

export interface PerdidaProductoType {
  id: number;
  nombre: string;
  codigo_barras: string | null;
  unidades: number;
  valor: number;
}

export interface ReportePerdidasType {
  indicadores: {
    total_unidades: number;
    valor_total: number;
    total_ajustes: number;
    productos_afectados: number;
  };
  por_tipo: PerdidaTipoType[];
  mas_afectados: PerdidaProductoType[];
}

export interface DetalleReporte<T> {
  filas: T[];
  cargando: boolean;
  paginacion: PaginacionTabla;
}
