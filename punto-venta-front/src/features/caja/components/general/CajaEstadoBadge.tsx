import { Badge } from "@/components/ui/badge";

interface Props {
  estado: string;
}

export function CajaEstadoBadge({ estado }: Props) {
  switch (estado) {
    case "abierta":
      return (
        <Badge variant="outline" className="border-emerald-600 bg-emerald-100/70 text-emerald-900 font-bold text-xs px-2.5 py-0.5">
          Abierta
        </Badge>
      );
    case "cerrada":
      return (
        <Badge variant="outline" className="border-slate-500 bg-slate-100/70 text-slate-800 font-bold text-xs px-2.5 py-0.5">
          Cerrada
        </Badge>
      );
    case "anulada":
      return (
        <Badge className="font-bold text-xs px-2.5 py-0.5 bg-red-500 text-white hover:bg-red-500">
          Anulada
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="capitalize font-bold text-xs px-2.5 py-0.5">
          {estado}
        </Badge>
      );
  }
}
