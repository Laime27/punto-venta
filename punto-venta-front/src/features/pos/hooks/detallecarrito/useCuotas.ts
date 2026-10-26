import { useState } from "react";
import { type CuotaType } from "../../types/PosType";
import { esNumeroDecimalValido } from "@/lib/utils";

export const fechaHoy = () => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

export function useCuotas() {
  const [cuotas, setCuotas] = useState<CuotaType[]>([]);

  const agregarCuota = () => {
    setCuotas([...cuotas, { fecha: fechaHoy(), monto: "" }]);
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

  const reiniciar = () => {
    setCuotas([]);
  };

  return { cuotas, agregarCuota, eliminarCuota, actualizarCuota, reiniciar };
}
