import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { listarSelectProductos } from "@/features/producto/services/ProductoService";
import type { ProductoAjusteResultado } from "../../types/AjusteInventarioType";

const SIN_RESULTADOS: ProductoAjusteResultado[] = [];

interface Props {
  onAgregar: (producto: ProductoAjusteResultado) => void;
}

export function useAjusteInventarioBuscadorProducto({ onAgregar }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const busquedaDebounce = useDebounce(busqueda, 300);
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);

  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: resultados = SIN_RESULTADOS, isLoading } = useQuery<ProductoAjusteResultado[]>({
    queryKey: ["productos-select-ajuste", busquedaDebounce],
    queryFn: () => listarSelectProductos(busquedaDebounce),
    enabled: busquedaDebounce.trim().length > 0,
  });

  const mostrarResultados = estaAbierto && busqueda.trim().length > 0 && resultados.length > 0;

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor);
    setEstaAbierto(true);
    setIndiceSeleccionado(0);
  };

  useEffect(() => {
    const handleClickAfuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setEstaAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, []);

  const seleccionar = (producto: ProductoAjusteResultado) => {
    onAgregar(producto);
    setBusqueda("");
    setEstaAbierto(false);
    inputRef.current?.focus();
  };

  const manejarTeclado = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!mostrarResultados) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndiceSeleccionado((p) => (p < resultados.length - 1 ? p + 1 : p));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndiceSeleccionado((p) => (p > 0 ? p - 1 : p));
    } else if (e.key === "Enter") {
      e.preventDefault();
      seleccionar(resultados[indiceSeleccionado]);
    } else if (e.key === "Escape") {
      setEstaAbierto(false);
    }
  };

  return {
    estado: { busqueda, mostrarResultados, indiceSeleccionado, resultados, isLoading },
    modificadores: { cambiarBusqueda, setEstaAbierto, setIndiceSeleccionado },
    referencias: { contenedorRef, inputRef },
    funciones: { seleccionar, manejarTeclado },
  };
}
