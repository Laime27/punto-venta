import type { UseFormRegisterReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ANCHOS_COMUNES } from "../validations/ImpresoraValidation";

interface ImpresoraAnchoInputProps {
  id?: string;
  registro: UseFormRegisterReturn<"ancho">;
  anchoActual: number;
  error?: string;
  onSeleccionarAncho: (ancho: number) => void;
}

export function ImpresoraAnchoInput({ id, registro, anchoActual, error, onSeleccionarAncho }: ImpresoraAnchoInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative w-full">
          <Input
            id={id}
            type="number"
            inputMode="numeric"
            className="pr-12"
            {...registro}
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">mm</span>
        </div>
        {ANCHOS_COMUNES.map((ancho) => (
          <Button
            key={ancho}
            type="button"
            variant={anchoActual === ancho ? "default" : "outline"}
            className="shrink-0"
            onClick={() => onSeleccionarAncho(ancho)}
          >
            {ancho} mm
          </Button>
        ))}
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Mida el ancho del rollo de papel. Lo más común: 80 mm o 58 mm.</p>
      )}
    </div>
  );
}
