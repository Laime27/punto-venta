import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { z } from "zod";
import { type MetodoPagoType } from "@/features/metodopago/types/MetodopagoType";
import { useDecimalInput } from "@/hooks/useDecimalInput";
import { type PagoAgregado } from "../../types/PosType";

const pagoSchema = z.object({
  monto: z.coerce.number().positive("El monto debe ser mayor a 0"),
});

export function useMetodosPago() {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPagoType | null>(null);
  const [monto, manejarCambioMonto, setMonto] = useDecimalInput("");
  const [pagosAgregados, setPagosAgregados] = useState<PagoAgregado[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (metodoSeleccionado) {
      inputRef.current?.focus();
    }
  }, [metodoSeleccionado]);

  const seleccionarMetodo = (metodo: MetodoPagoType, montoSugerido: number = 0) => {
    setMetodoSeleccionado(metodo);
    setMonto(montoSugerido > 0 ? montoSugerido.toString() : "");
  };

  const agregarPago = () => {
    if (!metodoSeleccionado || !monto) {
      return;
    }

    const resultadoValidacion = pagoSchema.safeParse({ monto });

    if (!resultadoValidacion.success) {
      return;
    }

    const nuevoPago: PagoAgregado = {
      id: Math.random().toString(36).substring(2, 9),
      metodo: metodoSeleccionado,
      monto: resultadoValidacion.data.monto,
    };

    setPagosAgregados((prev) => [...prev, nuevoPago]);
    setMetodoSeleccionado(null);
    setMonto("");
  };

  const eliminarPago = (id: string) => {
    setPagosAgregados((prev) => prev.filter((pago) => pago.id !== id));
  };

  const reiniciar = () => {
    setPagosAgregados([]);
    setMetodoSeleccionado(null);
    setMonto("");
  };

  const puedeAgregarPago = !!metodoSeleccionado && !!monto && Number(monto) > 0;

  const manejarKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && puedeAgregarPago) {
      e.preventDefault();
      agregarPago();
    }
  };

  const estado = {
    metodoSeleccionado,
    monto,
    pagosAgregados,
    puedeAgregarPago,
  };

  const acciones = {
    seleccionarMetodo,
    manejarCambioMonto,
    agregarPago,
    eliminarPago,
    manejarKeyDown,
    reiniciar,
  };

  const refs = {
    inputRef,
  };

  return { estado, acciones, refs };
}
