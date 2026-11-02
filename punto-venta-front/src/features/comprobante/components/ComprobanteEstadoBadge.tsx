import { Badge } from "@/components/ui/badge";

interface Props {
  estado: string;
}

export function ComprobanteEstadoBadge({ estado }: Props) {
  const normalizado = estado?.toLowerCase();

  switch (normalizado) {
    case "pagado":
      return (
        <Badge
          variant="outline"
          className="border-emerald-600 bg-emerald-100/70 text-emerald-900 font-bold text-xs px-2.5 py-0.5"
        >
          Pagado
        </Badge>
      );
    case "pendiente":
      return (
        <Badge
          variant="outline"
          className="border-amber-600 bg-amber-100/70 text-amber-900 font-bold text-xs px-2.5 py-0.5"
        >
          Pendiente
        </Badge>
      );
    case "anulado":
      return (
        <Badge
          className="font-bold text-xs px-2.5 py-0.5 bg-red-500 text-white hover:bg-red-500"
        >
          Anulado
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
