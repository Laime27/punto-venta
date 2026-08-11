import { createContext, useContext, type ReactNode } from "react";
import { useProductCart } from "../hooks/carrito/useProductCart";

type PosContextType = ReturnType<typeof useProductCart>;

const PosContext = createContext<PosContextType | undefined>(undefined);

export function PosProvider({ children }: { children: ReactNode }) {
  const cartHook = useProductCart();

  return (
    <PosContext.Provider value={cartHook}>
      {children}
    </PosContext.Provider>
  );
}

export function usePosContext() {
  const context = useContext(PosContext);
  if (context === undefined) {
    throw new Error("usePosContext debe ser usado dentro de un PosProvider");
  }
  return context;
}
