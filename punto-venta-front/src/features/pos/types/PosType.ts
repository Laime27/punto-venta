import { type MetodoPagoType } from "@/features/metodopago/types/MetodopagoType";
import {type UnidadType} from "@/features/unidad/types/UnidadType";

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
  imagen:string
}


export interface ProductoCarritoType extends ProductoBuscadoType {
  cantidad: number
  subtotal: number  
  precio_usado: number
  es_mayoreo: boolean
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
