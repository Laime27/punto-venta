import { Badge } from "@/components/ui/badge";

interface Props {
  estado: string;
}

export function CotizacionEstadoBadge({ estado }: Props) {
  switch (estado) {
    case "PENDIENTE":
      return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pendiente</Badge>;
    case "ACEPTADA":
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Aceptada</Badge>;
    case "RECHAZADA":
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Rechazada</Badge>;
    case "VENCIDA":
      return <Badge className="bg-red-500 text-white hover:bg-red-600">Vencida</Badge>;
    default:
      return <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-300">{estado}</Badge>;
  }
}
