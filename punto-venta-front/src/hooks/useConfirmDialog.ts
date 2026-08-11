import { useState } from "react";

export function useConfirmDialog() {
  const [abierto, setAbierto] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);

  const abrir = (id: number) => {
    setIdSeleccionado(id);
    setAbierto(true);
  };

  const cerrar = () => {
    setAbierto(false);
    setIdSeleccionado(null);
  };

  return { abierto, idSeleccionado, abrir, cerrar };
}
