import { Search, PackageOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProductSearch} from "../../hooks/buscadores/useProductSearch";
import { POSDecimalQuantityModal } from "./POSDecimalQuantityModal";
import { usePosContext } from "../../context/PosContext";
import { Kbd} from "@/components/ui/kbd"
import { Badge } from "@/components/ui/badge"

export function POSProductSearch() {
  const { estado, modificadores, referencias, funciones } = useProductSearch();
  const { funciones: { agregarProductoAlCarrito } } = usePosContext();

  const handleConfirmModal = (cantidad: number, precioUsado: number, esMayoreo: boolean) => {
    if (estado.productoAConfigurar) {
      agregarProductoAlCarrito(estado.productoAConfigurar, cantidad, precioUsado, esMayoreo);
      funciones.limpiarBusqueda();
      modificadores.setProductoAConfigurar(null);
    }
  };

  const renderDropdownContenido = () => {
    if (estado.estaCargando) {
      return (
        <div className="p-4 flex items-center justify-center text-sm text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
        </div>
      );
    }

    if (estado.resultados.length === 0) {
      return (
        <div className="p-6 flex flex-col items-center justify-center text-sm text-muted-foreground">
          <PackageOpen className="h-8 w-8 mb-2 opacity-50" />
          <p>No se encontraron productos para "{estado.busqueda}"</p>
        </div>
      );
    }

    return (
      <ul className="max-h-80 overflow-y-auto py-1 custom-scrollbar">
        {estado.resultados.map((producto, index) => (
          <li 
            key={producto.id}
            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors border-l-2 ${
              index === estado.indiceSeleccionado 
                ? "bg-primary/5 border-l-primary" 
                : "border-l-transparent hover:bg-muted/30"
            }`}
            onClick={() => funciones.agregarAlCarrito(producto)}
            onMouseEnter={() => modificadores.setIndiceSeleccionado(index)}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center shrink-0 border shadow-sm">
                {producto.imagen ? (
                  <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                ) : (
                  <PackageOpen className="h-5 w-5 text-muted-foreground/70" />
                )}
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold text-base leading-tight text-foreground">
                  {producto.nombre}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono font-medium ">
                    {producto.codigo_barras || ""}
                  </span>
                  {Number(producto.precio_mayoreo) > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      Mayoreo: S/ {Number(producto.precio_mayoreo).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right shrink-0 flex flex-col items-end">
              <div className="font-bold  text-base">
                S/ {Number(producto.precio_venta).toFixed(2)}
              </div>
                <Badge variant="outline" className={`text-[12px] font-bold ${producto.stock > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                  Stock: {producto.stock}
                </Badge>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="relative flex-1" ref={referencias.contenedorRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input 
            ref={referencias.inputRef}
            value={estado.busqueda}
            onChange={(e) => modificadores.setBusqueda(e.target.value)}
            onKeyDown={funciones.manejarTeclado}
            onFocus={() => {
              if (estado.resultados.length > 0) modificadores.setEstaAbierto(true);
            }}
            placeholder="Buscar producto por nombre o código de barras..." 
            className="pl-9 pr-12 h-11 bg-card border-border rounded-2xl shadow-sm text-sm font-medium"
          />
          {estado.estaCargando ? (
            <div className="absolute right-2 text-muted-foreground bg-background p-1 rounded">
               <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <div className="absolute right-2 text-xs font-bold text-muted-foreground bg-background/50 border px-1.5 py-0.5 rounded shadow-sm">
              <Kbd className="text-primary text-md font-semibold">F3</Kbd>
            </div>
          )}
        </div>

        {estado.estaAbierto && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
            {renderDropdownContenido()}
          </div>
        )}
      </div>
      
      <POSDecimalQuantityModal 
        isOpen={!!estado.productoAConfigurar}
        onClose={() => modificadores.setProductoAConfigurar(null)}
        producto={estado.productoAConfigurar}
        onConfirm={handleConfirmModal}
      />
    </>
  );
}
