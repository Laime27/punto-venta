import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export function CajaCerradaAviso() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 shrink-0">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        No hay una caja abierta. Debe abrir una caja antes de registrar ventas.{" "}
        <Link to="/caja" className="font-bold underline underline-offset-2">
          Ir a Caja
        </Link>
      </span>
    </div>
  );
}
