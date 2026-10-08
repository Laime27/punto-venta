import { useState } from "react";
import { POSCarritoTabla } from "./components/carrito/POSCarritoTabla";
import { POSResumen } from "./components/detallecarrito/POSResumen";
import { PosProveedor } from "./context/PosContexto";
import { ShoppingCart, CreditCard } from "lucide-react";

export default function POS() {
  const [vistaActiva, setVistaActiva] = useState<"carrito" | "pago">("carrito");

  return (
    <PosProveedor>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] p-2 lg:p-3 xl:p-4 pt-2 gap-2 xl:gap-4 overflow-hidden">
        
        <div className="xl:hidden flex bg-muted/50 rounded-xl p-1 w-full border shrink-0">
          <button
            onClick={() => setVistaActiva("carrito")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              vistaActiva === "carrito"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Carrito</span>
          </button>
          <button
            onClick={() => setVistaActiva("pago")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              vistaActiva === "pago"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Cobrar</span>
          </button>
        </div>

        <div className="flex flex-col xl:flex-row flex-1 gap-2 xl:gap-4 overflow-hidden">
          
          <div className={`flex-1 overflow-hidden h-full ${vistaActiva === "carrito" ? "flex flex-col" : "hidden xl:flex xl:flex-col"}`}>
            <POSCarritoTabla />
          </div>

          <div className={`w-full xl:w-[400px] 2xl:w-[450px] shrink-0 h-full overflow-hidden ${vistaActiva === "pago" ? "flex flex-col" : "hidden xl:flex xl:flex-col"}`}>
            <POSResumen />
          </div>
        </div>

      </div>
    </PosProveedor>
  );
}

