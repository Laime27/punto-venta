import { Search, PackageOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useOrdenCompraBuscadorProducto, type ProductoResultado } from "../../hooks/general/useOrdenCompraBuscadorProducto";

interface Props {
  onAgregar: (producto: ProductoResultado) => void;
}

export function OrdenCompraBuscadorProducto({ onAgregar }: Props) {
  const {
    estado: { busqueda, estaAbierto, indiceSeleccionado, resultados, isLoading },
    modificadores: { setBusqueda, setEstaAbierto, setIndiceSeleccionado },
    referencias: { contenedorRef, inputRef },
    funciones: { seleccionar, manejarTeclado },
  } = useOrdenCompraBuscadorProducto({ onAgregar });

  return (
    <div className="relative" ref={contenedorRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={manejarTeclado}
          onFocus={() => { if (resultados.length > 0) setEstaAbierto(true); }}
          placeholder="Buscar producto por nombre para agregar..."
          className="pl-9 pr-10 h-11 rounded-lg shadow-sm"
        />
        {isLoading && (
          <div className="absolute right-3 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>

      {estaAbierto && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
            </div>
          ) : resultados.length === 0 ? (
            <div className="p-6 flex flex-col items-center justify-center text-sm text-muted-foreground">
              <PackageOpen className="h-8 w-8 mb-2 opacity-40" />
              <p>No se encontraron productos para "{busqueda}"</p>
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {resultados.map((producto, index) => (
                <li
                  key={producto.id}
                  onClick={() => seleccionar(producto)}
                  onMouseEnter={() => setIndiceSeleccionado(index)}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors border-l-2 ${
                    index === indiceSeleccionado
                      ? "bg-primary/5 border-l-primary"
                      : "border-l-transparent hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-muted rounded-md flex items-center justify-center shrink-0 border">
                      {producto.imagen ? (
                        <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover rounded-md" />
                      ) : (
                        <PackageOpen className="h-4 w-4 text-muted-foreground/60" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{producto.nombre}</span>
                  </div>
                  {producto.precio_compra != null && (
                    <span className="text-sm font-medium">
                      Costo: {Number(producto.precio_compra).toFixed(2)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
