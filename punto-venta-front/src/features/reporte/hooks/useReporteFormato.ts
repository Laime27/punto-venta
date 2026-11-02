import { useMonedaHook } from "@/features/empresa/hooks/useMonedaHook";
import { formatearMoneda } from "@/lib/utils";

const compacto = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export const useReporteFormato = () => {
  const { simbolo } = useMonedaHook();

  return {
    moneda: (valor: number) => `${simbolo} ${formatearMoneda(valor)}`,
    monedaCompacta: (valor: number) => `${simbolo} ${compacto.format(valor)}`,
    porcentaje: (valor: number) => `${valor.toFixed(1)}%`,
    numero: (valor: number) => Number(valor.toFixed(2)).toLocaleString("en-US"),
    fecha: (valor: string) => valor.split("-").reverse().join("/"),
  };
};
