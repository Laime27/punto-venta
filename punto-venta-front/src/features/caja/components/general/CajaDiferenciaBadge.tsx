import { Badge } from "@/components/ui/badge";
import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";

interface Props {
  diferencia: number | string | null;
  mostrarEtiqueta?: boolean;
}

export function CajaDiferenciaBadge({ diferencia, mostrarEtiqueta = false }: Props) {
  const { simbolo } = useMonedaHook();
  if (diferencia === null) return <span className="text-muted-foreground">-</span>;

  const valor = Number(diferencia);

  const { etiqueta, className } =
    valor === 0
      ? { etiqueta: "Cuadrado", className: "border-emerald-600 bg-emerald-100/70 text-emerald-900" }
      : valor > 0
        ? { etiqueta: "Sobrante", className: "border-blue-600 bg-blue-100/70 text-blue-900" }
        : { etiqueta: "Faltante", className: "border-red-600 bg-red-100/70 text-red-900" };

  return (
    <Badge variant="outline" className={`font-bold text-xs px-2.5 py-0.5 whitespace-nowrap ${className}`}>
      {mostrarEtiqueta && `${etiqueta}: `}
      {simbolo} {valor.toFixed(2)}
    </Badge>
  );
}
