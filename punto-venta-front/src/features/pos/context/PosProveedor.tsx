import { type ReactNode } from "react";
import { useCarritoProducto } from "../hooks/carrito/useCarritoProducto";
import { PosContexto } from "./PosContexto";

export function PosProveedor({ children }: { children: ReactNode }) {
  const cartHook = useCarritoProducto();

  return (
    <PosContexto.Provider value={cartHook}>
      {children}
    </PosContexto.Provider>
  );
}
