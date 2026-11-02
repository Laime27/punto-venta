import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CotizacionType } from "../../types/CotizacionType";
import { useCotizacionCambiarEstado } from "../../hooks/general/useCotizacionCambiarEstado";

interface Props {
  cotizacion: CotizacionType | null;
  onClose: () => void;
}

export function CotizacionCambiarEstadoDialog({ cotizacion, onClose }: Props) {
  const {
    nuevoEstado,
    setNuevoEstado,
    motivoRechazo,
    setMotivoRechazo,
    handleGuardarEstado,
    isPending,
  } = useCotizacionCambiarEstado(cotizacion, onClose);

  return (
    <Dialog open={!!cotizacion} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar Estado de Cotización</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo estado para la cotización {cotizacion?.serie}-{cotizacion?.correlativo}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nuevo Estado</Label>
            <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACEPTADA">Aceptada</SelectItem>
                <SelectItem value="RECHAZADA">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {nuevoEstado === "RECHAZADA" && (
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo de Rechazo <span className="text-red-500">*</span></Label>
              <Textarea
                id="motivo"
                placeholder="Escriba el motivo del rechazo..."
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleGuardarEstado} 
            disabled={isPending || (nuevoEstado === "RECHAZADA" && !motivoRechazo.trim())}
          >
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
