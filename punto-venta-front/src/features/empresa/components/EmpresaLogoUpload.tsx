import { useRef } from "react";
import { Building2, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TIPOS_LOGO_PERMITIDOS } from "../validations/EmpresaValidation";

interface EmpresaLogoUploadProps {
  vistaPrevia: string | null;
  error?: string;
  deshabilitado?: boolean;
  onCambiar: (archivo: File) => void;
  onQuitar: () => void;
}

export function EmpresaLogoUpload({ vistaPrevia, error, deshabilitado, onCambiar, onQuitar }: EmpresaLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) onCambiar(archivo);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Label className="self-start md:self-center">Logo</Label>
      <input
        type="file"
        accept={TIPOS_LOGO_PERMITIDOS.join(",")}
        ref={inputRef}
        className="hidden"
        onChange={manejarCambioArchivo}
      />

      <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
        {vistaPrevia ? (
          <img src={vistaPrevia} alt="Logo de la empresa" className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Building2 className="h-10 w-10" />
            <span className="text-xs">Sin logo</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={deshabilitado}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          Cambiar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          disabled={deshabilitado || !vistaPrevia}
          onClick={onQuitar}
        >
          <Trash2 className="h-4 w-4" />
          Quitar
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">JPG, PNG o WEBP. Máximo 2MB.</p>
      {error && <p className="text-center text-xs text-destructive">{error}</p>}
    </div>
  );
}
