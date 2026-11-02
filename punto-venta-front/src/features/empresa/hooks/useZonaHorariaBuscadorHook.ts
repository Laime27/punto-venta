import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { ZonaHorariaOpcion } from "../types/EmpresaType";

const MAX_RESULTADOS = 50;

const normalizar = (texto: string) =>
  texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/_/g, " ");

export const useZonaHorariaBuscadorHook = (
  opciones: ZonaHorariaOpcion[],
  valor: string,
  onChange: (valor: string) => void
) => {
  const [busqueda, setBusqueda] = useState("");
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const opcionSeleccionada = opciones.find((opcion) => opcion.value === valor);
  const etiquetaSeleccionada = opcionSeleccionada?.label ?? valor;

  const resultados = useMemo(() => {
    const termino = normalizar(busqueda.trim());
    const filtradas = termino
      ? opciones.filter((opcion) => normalizar(opcion.label).includes(termino))
      : opciones;
    return filtradas.slice(0, MAX_RESULTADOS);
  }, [busqueda, opciones]);

  useEffect(() => {
    const manejarClickFuera = (evento: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setEstaAbierto(false);
        setBusqueda("");
      }
    };
    document.addEventListener("mousedown", manejarClickFuera);
    return () => document.removeEventListener("mousedown", manejarClickFuera);
  }, []);

  const abrir = () => {
    setBusqueda("");
    setIndiceSeleccionado(0);
    setEstaAbierto(true);
  };

  const cerrar = () => {
    setEstaAbierto(false);
    setBusqueda("");
  };

  const cambiarBusqueda = (texto: string) => {
    setBusqueda(texto);
    setIndiceSeleccionado(0);
    setEstaAbierto(true);
  };

  const seleccionar = (opcion: ZonaHorariaOpcion) => {
    onChange(opcion.value);
    cerrar();
    inputRef.current?.blur();
  };

  const manejarTeclado = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (!estaAbierto && (evento.key === "ArrowDown" || evento.key === "Enter")) {
      evento.preventDefault();
      abrir();
      return;
    }

    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setIndiceSeleccionado((indice) => Math.min(indice + 1, resultados.length - 1));
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setIndiceSeleccionado((indice) => Math.max(indice - 1, 0));
    } else if (evento.key === "Enter") {
      evento.preventDefault();
      const opcion = resultados[indiceSeleccionado];
      if (opcion) seleccionar(opcion);
    } else if (evento.key === "Escape") {
      cerrar();
    }
  };

  return {
    estado: {
      busqueda,
      estaAbierto,
      indiceSeleccionado,
      resultados,
      etiquetaSeleccionada,
    },
    contenedorRef,
    inputRef,
    funciones: { abrir, cambiarBusqueda, seleccionar, manejarTeclado },
    modificadores: { setIndiceSeleccionado },
  };
};
