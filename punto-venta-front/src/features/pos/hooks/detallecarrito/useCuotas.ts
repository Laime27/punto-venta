import { useState } from "react";
import { type CuotaType } from "../../types/PosType";
import { esNumeroDecimalValido } from "@/lib/utils";

export function useCuotas() {
  const [cuotas, setCuotas] = useState<CuotaType[]>([]);

  const agregarCuota = () => {
    setCuotas([...cuotas, { fecha: new Date().toISOString().split('T')[0], monto: "" }]);
  };

  const eliminarCuota = (index: number) => {
    setCuotas(cuotas.filter((_, i) => i !== index));
  };

  const actualizarCuota = (index: number, field: string, value: string) => {
    if (field === 'monto' && !esNumeroDecimalValido(value)) {
      return;
    }
    const newCuotas = [...cuotas];
    newCuotas[index] = { ...newCuotas[index], [field]: value };
    setCuotas(newCuotas);
  };

  return { cuotas, agregarCuota, eliminarCuota, actualizarCuota };
}
