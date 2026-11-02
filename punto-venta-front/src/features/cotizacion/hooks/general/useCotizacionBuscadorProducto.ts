import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { listarSelectProductos } from "@/features/producto/services/ProductoService";

export interface ProductoResultado {
  id: number;
  nombre: string;
  precio_venta?: number;
  stock?: number;
  imagen?: string;
}

interface UseCotizacionBuscadorProductoProps {
  onAgregar: (producto: ProductoResultado) => void;
}

export function useCotizacionBuscadorProducto({ onAgregar }: UseCotizacionBuscadorProductoProps) {
  const [busqueda, setBusqueda] = useState("");
  const busquedaDebounce = useDebounce(busqueda, 300);
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  
  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: resultadosRaw = [], isLoading } = useQuery({
    queryKey: ["productos-select-cotizacion", busquedaDebounce],
    queryFn: () => listarSelectProductos(busquedaDebounce),
    enabled: busquedaDebounce.trim().length > 0,
  });

  const resultados: ProductoResultado[] = Array.isArray(resultadosRaw)
    ? resultadosRaw
    : (resultadosRaw as any).data ?? [];

  useEffect(() => {
    if (resultados.length > 0) {
      setEstaAbierto(true);
      setIndiceSeleccionado(0);
    } else {
      setEstaAbierto(false);
    }
  }, [resultados]);

  useEffect(() => {
    const handleClickAfuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setEstaAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickAfuera);
    return () => document.removeEventListener("mousedown", handleClickAfuera);
  }, []);

  const seleccionar = (producto: ProductoResultado) => {
    onAgregar(producto);
    setBusqueda("");
    setEstaAbierto(false);
  };

  const manejarTeclado = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!estaAbierto || resultados.length === 0) return;
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
    estado: {
      busqueda,
      estaAbierto,
      indiceSeleccionado,
      resultados,
      isLoading,
    },
    modificadores: {
      setBusqueda,
      setEstaAbierto,
      setIndiceSeleccionado,
    },
    referencias: {
      contenedorRef,
      inputRef,
    },
    funciones: {
      seleccionar,
      manejarTeclado,
    }
  };
}
