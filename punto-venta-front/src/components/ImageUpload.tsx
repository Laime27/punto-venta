import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubirImagenProps {
  vistaPrevia: string | null;
  alCambiar: (archivo: File | null) => void;
  alEliminar?: () => void;
  textoAlternativo?: string;
}

export function SubirImagen({ vistaPrevia, alCambiar, alEliminar, textoAlternativo = "Subir imagen" }: SubirImagenProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      alCambiar(archivo);
    }
  };

  const manejarEliminar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = "";
    alCambiar(null);
    if (alEliminar) alEliminar();
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={manejarCambioArchivo}
      />

      {vistaPrevia ? (
        <div 
          className="relative h-40 w-40 overflow-hidden rounded-lg border border-border bg-muted group cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <img src={vistaPrevia} alt="Vista previa" className="h-full w-full object-cover" />
          
          {/* Overlay oscuro para indicar que se puede cambiar la foto */}
          <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Cambiar foto</span>
          </div>

          {/* Botón de eliminar en la esquina con colores fuertes */}
          <button
            type="button"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-700 opacity-0 group-hover:opacity-100"
            onClick={manejarEliminar}
            title="Eliminar imagen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-40 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 transition-colors hover:bg-muted/50 hover:border-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <div className="rounded-full bg-secondary p-3">
             <ImagePlus className="h-6 w-6 text-secondary-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground text-center px-4">{textoAlternativo}</span>
        </button>
      )}
    </div>
  );
}
