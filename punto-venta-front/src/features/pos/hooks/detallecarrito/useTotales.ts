import { useState } from "react";
import { usePosContextoo } from "../../context/PosContexto";
import { type PagoAgregado } from "../../types/PosType";
import { esNumeroDecimalValido } from "@/lib/utils";

export function useTotales(pagosAgregados: PagoAgregado[] = []) {
  const { estado: { total } } = usePosContextoo();
  const [descuentoText, setDescuentoText] = useState("");

  const subtotal = total;

  const manejarCambioDescuento = (valor: string) => {
    if (esNumeroDecimalValido(valor)) {
      if (Number(valor) > subtotal) {
        setDescuentoText(subtotal.toString());
      } else {
        setDescuentoText(valor);
      }
    }
  };

  const descuentoValue = Number(descuentoText) || 0;
  const descuento = Math.min(descuentoValue, subtotal);
  const totalCobrar = subtotal - descuento;
  const totalPagado = pagosAgregados.reduce((sum, pago) => sum + pago.monto, 0); 
  const porPagar = Math.max(0, totalCobrar - totalPagado);
  const vuelto = totalPagado > totalCobrar ? totalPagado - totalCobrar : 0;
  
  const estado = {
    subtotal,
    descuento,
    descuentoText,
    totalCobrar,
    totalPagado,
    porPagar,
    vuelto
  };

  const reiniciar = () => {
    setDescuentoText("");
  };

  // Sin tope por subtotal: se usa justo al cargar un carrito nuevo, cuando el subtotal aún no se actualizó
  const establecerDescuento = (monto: number) => {
    setDescuentoText(monto > 0 ? monto.toFixed(2) : "");
  };

  const acciones = {
    manejarCambioDescuento,
    establecerDescuento,
    reiniciar
  };

  return { estado, acciones };
}
