import { useState, useEffect, type KeyboardEvent, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ProductoBuscadoType } from "../../types/PosType";
import { PackageOpen, Check, X } from "lucide-react";

interface POSDecimalQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: ProductoBuscadoType | null;
  onConfirm: (cantidad: number, precioUsado: number, esMayoreo: boolean) => void;
}

export function POSDecimalQuantityModal({
  isOpen,
  onClose,
  producto,
  onConfirm
}: POSDecimalQuantityModalProps) {
  const [cantidadInput, setCantidadInput] = useState<string>("1");
  const [esMayoreo, setEsMayoreo] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && producto) {
      setCantidadInput("1");
      setEsMayoreo(false);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, producto]);

  if (!producto) return null;

  const cantidadNum = Number(cantidadInput) || 0;
  const precioVenta = Number(producto.precio_venta);
  const precioMayoreo = Number(producto.precio_mayoreo);
  
  const tieneMayoreo = precioMayoreo > 0;
  const precioActivo = esMayoreo && tieneMayoreo ? precioMayoreo : precioVenta;
  const subtotal = cantidadNum * precioActivo;

  const handleConfirm = () => {
    if (cantidadNum <= 0) return;
    if (cantidadNum > producto.stock) return;
    onConfirm(cantidadNum, precioActivo, esMayoreo);
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-primary" />
            Configurar Producto
          </DialogTitle>
          <DialogDescription>
            {producto.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
            <span className="text-sm font-medium">Stock Disponible:</span>
            <span className={`text-sm font-bold ${producto.stock > 0 ? "text-emerald-600" : "text-destructive"}`}>
              {producto.stock} {producto.unidad?.nombre}
            </span>
          </div>

          <div className="space-y-3">
            <Label>Cantidad ({producto.unidad?.nombre || "Unidades"})</Label>
            <Input 
              ref={inputRef}
              type="number" 
              step="any"
              min="0.01"
              max={producto.stock}
              value={cantidadInput}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setCantidadInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-lg font-bold h-12"
            />
            {cantidadNum > producto.stock && (
              <p className="text-xs text-destructive font-medium">
                La cantidad no puede superar el stock.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Precio a utilizar</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={!esMayoreo ? "default" : "outline"}
                className="h-16 flex flex-col items-center justify-center gap-1"
                onClick={() => setEsMayoreo(false)}
              >
                <span className="text-xs font-normal opacity-80">Precio Venta</span>
                <span className="text-sm font-bold">S/ {precioVenta.toFixed(2)}</span>
              </Button>
              <Button
                type="button"
                variant={esMayoreo ? "default" : "outline"}
                disabled={!tieneMayoreo}
                className="h-16 flex flex-col items-center justify-center gap-1"
                onClick={() => setEsMayoreo(true)}
              >
                <span className="text-xs font-normal opacity-80">Precio Mayoreo</span>
                <span className="text-sm font-bold">
                  {tieneMayoreo ? `S/ ${precioMayoreo.toFixed(2)}` : "No disponible"}
                </span>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <span className="text-sm font-medium text-muted-foreground">Subtotal:</span>
            <span className="text-xl font-bold text-primary">S/ {subtotal.toFixed(2)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={cantidadNum <= 0 || cantidadNum > producto.stock}
          >
            <Check className="h-4 w-4 mr-2" />
            Agregar al Carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
