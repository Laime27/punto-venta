import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmpresaFormActionsProps {
  hayCambios: boolean;
  guardando: boolean;
  onCancelar: () => void;
}

export function EmpresaFormActions({ hayCambios, guardando, onCancelar }: EmpresaFormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" disabled={!hayCambios || guardando} onClick={onCancelar}>
        Cancelar
      </Button>
      <Button type="submit" disabled={!hayCambios || guardando} className="gap-2">
        {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {guardando ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
}
