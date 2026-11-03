import { ShieldX } from "lucide-react";
import { EstadoPagina } from "@/components/EstadoPagina";

export function SinAcceso() {
  return (
    <EstadoPagina
      icono={ShieldX}
      titulo="No tienes acceso a esta sección"
      descripcion="Solicita al administrador que te asigne el permiso correspondiente."
    />
  );
}
