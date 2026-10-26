
import { type CategoriaType } from "@/features/categoria/types/CategoriaType";
import { type UnidadType } from "@/features/unidad/types/UnidadType";
import { type ProveedorType } from "@/features/proveedor/types/ProveedorType";

export interface ProductoType {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_compra: number;
  precio_venta: number;
  precio_mayoreo: number;
  stock: number;
  stock_minimo: number;
  codigo_barras: string | null;
  imagen: string | null;
  disponible_venta: boolean;
  categoria_id: number | null;
  unidad_id: number | null;
  categoria: CategoriaType | null;
  unidad: UnidadType | null;
  proveedores: ProveedorType[];
  created_at: string;
  updated_at: string;
}

export interface StatsType {
  total_costo: string;
  total_venta: string;
  utilidad_proyectada: string;
}

export interface FiltrosProductosType {
  categoria_id?: number | null;
  disponibilidad?: 1 | 0;
  stock?: "todos" | "stock_bajo" | "stock_normal" ;
  search?: string;
  // disponibilidad?: "todos" | "disponible" | "no_disponible";
}

export interface ErrorFilaExcelType {
  fila: number;
  campo: string;
  errores: string[];
  valores?: Record<string, unknown>;
}

export interface ErrorImportacionType {
  mensaje: string;
  errores?: ErrorFilaExcelType[];
}
