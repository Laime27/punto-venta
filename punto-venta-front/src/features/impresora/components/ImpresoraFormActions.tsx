import { Loader2, Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImpresoraFormActionsProps {
  hayCambios: boolean;
  guardando: boolean;
  imprimiendo: boolean;
  puedeImprimir: boolean;
  onCancelar: () => void;
  onImprimirPrueba: () => void;
}

export function ImpresoraFormActions({
  hayCambios,
  guardando,
  imprimiendo,
  puedeImprimir,
  onCancelar,
  onImprimirPrueba,
}: ImpresoraFormActionsProps) {
  return (
    <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <Button type="button" variant="secondary" className="gap-2" disabled={!puedeImprimir} onClick={onImprimirPrueba}>
        {imprimiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
        {imprimiendo ? "Imprimiendo..." : "Imprimir prueba"}
      </Button>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={!hayCambios || guardando} onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!hayCambios || guardando} className="gap-2">
          {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
