import { SIMBOLO_MONEDA_DEFAULT } from "@/lib/constants";
import { useEmpresaHook } from "./useEmpresaHook";

export const useMonedaHook = () => {
  const { empresa } = useEmpresaHook();
  const simbolo = empresa?.moneda_simbolo ?? SIMBOLO_MONEDA_DEFAULT;

  const formatearMonto = (valor: number | string | null | undefined) =>
    `${simbolo} ${Number(valor ?? 0).toFixed(2)}`;

  return {
    simbolo,
    formatearMonto,
  };
};
