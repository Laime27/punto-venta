import { Badge } from "@/components/ui/badge";

interface Props {
  estado: string;
}

export function OrdenCompraEstadoBadge({ estado }: Props) {
  switch (estado) {
    case "PENDIENTE":
      return <Badge >Pendiente</Badge>;
    case "RECIBIDA_PARCIAL":
      return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Recibida Parcial</Badge>;
    case "RECIBIDA_COMPLETA":
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Recibida Completa</Badge>;
    case "ANULADA":
      return <Badge variant="destructive">Anulada</Badge>;
    default:
      return <Badge>{estado}</Badge>;
  }
}
