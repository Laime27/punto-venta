import { useState } from "react";
import { esNumeroDecimalValido } from "@/lib/utils";


export function useDecimalInput(initialValue: string = "") {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (valor: string) => {
    if (esNumeroDecimalValido(valor)) {
      setValue(valor);
    }
  };

  return [value, onChange, setValue] as const;
}
