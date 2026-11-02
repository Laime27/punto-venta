import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface POSCajaCerradaAvisoProps {
  abierto: boolean;
  onIrACaja: () => void;
}

export function POSCajaCerradaAviso({ abierto, onIrACaja }: POSCajaCerradaAvisoProps) {
  return (
    <AlertDialog open={abierto}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Caja cerrada
          </AlertDialogTitle>
          <AlertDialogDescription>
            No hay una caja abierta. Debe abrir una caja antes de registrar ventas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onIrACaja}>Abrir caja</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
