export interface MetodoPagoType {
  id: number;
  nombre: string;
  tipo: 'efectivo' | 'tarjeta' | 'transferencia';
  activo: boolean;
}
