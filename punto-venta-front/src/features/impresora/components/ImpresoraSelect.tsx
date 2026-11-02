import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ImpresoraOpcion } from "../types/ImpresoraType";

interface ImpresoraSelectProps {
  id?: string;
  valor: string;
  onChange: (valor: string) => void;
  opciones: ImpresoraOpcion[];
  refrescando: boolean;
  onRefrescar: () => void;
}

export function ImpresoraSelect({ id, valor, onChange, opciones, refrescando, onRefrescar }: ImpresoraSelectProps) {
  return (
    <div className="flex gap-2">
      {/* Radix dispara onValueChange("") al cambiar la lista de opciones; se ignora para no borrar la selección */}
      <Select value={valor} onValueChange={(nuevoValor) => nuevoValor && onChange(nuevoValor)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={opciones.length ? "Seleccione una impresora" : "No hay impresoras disponibles"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {opciones.map((opcion) => (
              <SelectItem key={opcion.nombre} value={opcion.nombre}>
                {opcion.nombre}
                {opcion.noEncontrada && <span className="text-destructive"> (no encontrada)</span>}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        title="Refrescar lista de impresoras"
        disabled={refrescando}
        onClick={onRefrescar}
      >
        <RefreshCw className={`h-4 w-4 ${refrescando ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
