import { useState } from "react";

export function useSubirImagen() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);

  const manejarCambioImagen = (nuevoArchivo: File | null) => {
    setArchivo(nuevoArchivo);
    if (nuevoArchivo) {
      setVistaPrevia(URL.createObjectURL(nuevoArchivo));
    } else {
      setVistaPrevia(null);
    }
  };

  const eliminarImagen = () => {
    setArchivo(null);
    setVistaPrevia(null);
  };

  return {
    archivo,
    vistaPrevia,
    manejarCambioImagen,
    eliminarImagen,
    setVistaPrevia,
  };
}
