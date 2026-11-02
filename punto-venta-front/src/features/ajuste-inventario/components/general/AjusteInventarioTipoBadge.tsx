import { Badge } from "@/components/ui/badge";
import { TIPO_DANO, TIPO_PERDIDA, TIPO_RECUENTO, TIPOS_AJUSTE } from "../../validations/AjusteInventarioValidation";

const ESTILOS: Record<number, string> = {
  [TIPO_RECUENTO]: "border-blue-600 bg-blue-100/70 text-blue-900",
  [TIPO_PERDIDA]: "border-amber-600 bg-amber-100/70 text-amber-900",
  [TIPO_DANO]: "border-red-600 bg-red-100/70 text-red-900",
};

interface Props {
  tipoId: number;
}

export function AjusteInventarioTipoBadge({ tipoId }: Props) {
  const tipo = TIPOS_AJUSTE.find((t) => t.id === tipoId);

  return (
    <Badge variant="outline" className={`font-bold text-xs px-2.5 py-0.5 ${ESTILOS[tipoId] ?? ""}`}>
      {tipo?.nombre ?? "Desconocido"}
    </Badge>
  );
}
