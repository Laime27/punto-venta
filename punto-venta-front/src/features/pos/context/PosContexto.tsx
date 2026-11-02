import { createContext, useContext } from "react";
import type { useCarritoProducto } from "../hooks/carrito/useCarritoProducto";

export type PosContextoType = ReturnType<typeof useCarritoProducto>;

// El contexto vive en un archivo sin dependencias de runtime para que la recarga en caliente (HMR)
// no lo vuelva a crear al editar el carrito; el proveedor está en PosProveedor.tsx
export const PosContexto = createContext<PosContextoType | undefined>(undefined);

export function usePosContextoo() {
  const context = useContext(PosContexto);
  if (context === undefined) {
    throw new Error("usePosContextoo debe ser usado dentro de un PosProveedor");
  }
  return context;
}
