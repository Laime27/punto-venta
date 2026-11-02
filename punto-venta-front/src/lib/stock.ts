export type EstadoStock = "bajo" | "por_agotarse" | "normal";

const FACTOR_POR_AGOTARSE = 1.5;

export function calcularEstadoStock(stock: number, stockMinimo: number): EstadoStock {
  if (stock <= stockMinimo) return "bajo";
  if (stock <= stockMinimo * FACTOR_POR_AGOTARSE) return "por_agotarse";
  return "normal";
}
