import { Search, PackageOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAjusteInventarioBuscadorProducto } from "../../hooks/crear/useAjusteInventarioBuscadorProducto";
import type { ProductoAjusteResultado } from "../../types/AjusteInventarioType";

interface Props {
  onAgregar: (producto: ProductoAjusteResultado) => void;
}

export function AjusteInventarioBuscadorProducto({ onAgregar }: Props) {
  const {
    estado: { busqueda, mostrarResultados, indiceSeleccionado, resultados, isLoading },
    modificadores: { cambiarBusqueda, setEstaAbierto, setIndiceSeleccionado },
    referencias: { contenedorRef, inputRef },
    funciones: { seleccionar, manejarTeclado },
  } = useAjusteInventarioBuscadorProducto({ onAgregar });

  return (
    <div className="relative" ref={contenedorRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={busqueda}
          onChange={(e) => cambiarBusqueda(e.target.value)}
          onKeyDown={manejarTeclado}
          onFocus={() => setEstaAbierto(true)}
          placeholder="Buscar o escanear producto por nombre o código..."
          className="pl-9 pr-10 h-11 rounded-lg shadow-sm"
          autoFocus
        />
        {isLoading && (
          <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {mostrarResultados && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-xl z-50 overflow-hidden">
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
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 bg-muted rounded-md flex items-center justify-center shrink-0 border">
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover rounded-md" />
                    ) : (
                      <PackageOpen className="h-4 w-4 text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{producto.nombre}</p>
                    {producto.codigo_barras && (
                      <p className="text-xs text-muted-foreground">{producto.codigo_barras}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium shrink-0">
                  Stock: {Number(producto.stock)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
