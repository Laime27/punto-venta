import { ChevronDown, Globe, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useZonaHorariaBuscadorHook } from "../hooks/useZonaHorariaBuscadorHook";
import type { ZonaHorariaOpcion } from "../types/EmpresaType";

interface EmpresaZonaHorariaSelectProps {
  id?: string;
  valor: string;
  onChange: (valor: string) => void;
  opciones: ZonaHorariaOpcion[];
  cargando?: boolean;
}

export function EmpresaZonaHorariaSelect({ id, valor, onChange, opciones, cargando }: EmpresaZonaHorariaSelectProps) {
  const { estado, contenedorRef, inputRef, funciones, modificadores } = useZonaHorariaBuscadorHook(opciones, valor, onChange);

  return (
    <div className="relative" ref={contenedorRef}>
      <div className="relative flex items-center">
        <Globe className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          ref={inputRef}
          value={estado.estaAbierto ? estado.busqueda : estado.etiquetaSeleccionada}
          placeholder={estado.estaAbierto ? estado.etiquetaSeleccionada || "Buscar zona horaria..." : "Seleccione una zona horaria"}
          onChange={(e) => funciones.cambiarBusqueda(e.target.value)}
          onFocus={funciones.abrir}
          onKeyDown={funciones.manejarTeclado}
          autoComplete="off"
          className="pl-9 pr-9"
        />
        {cargando ? (
          <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {estado.estaAbierto && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border bg-card shadow-xl">
          {estado.resultados.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {cargando ? "Cargando zonas horarias..." : `No se encontraron zonas para "${estado.busqueda}"`}
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {estado.resultados.map((opcion, index) => (
                <li
                  key={opcion.value}
                  className={`cursor-pointer border-l-2 px-4 py-2 text-sm transition-colors ${
                    index === estado.indiceSeleccionado
                      ? "border-l-primary bg-primary/5"
                      : "border-l-transparent hover:bg-muted/30"
                  } ${opcion.value === valor ? "font-semibold" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => funciones.seleccionar(opcion)}
                  onMouseEnter={() => modificadores.setIndiceSeleccionado(index)}
                >
                  {opcion.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
