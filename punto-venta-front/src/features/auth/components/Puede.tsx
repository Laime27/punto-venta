import type { ReactNode } from "react";
import { usePermisos, type RequisitoPermiso } from "../hooks/usePermisos";

interface Props {
  permiso: RequisitoPermiso;
  children: ReactNode;
  alternativa?: ReactNode;
}

export function Puede({ permiso, children, alternativa = null }: Props) {
  const { puede } = usePermisos();
  return <>{puede(permiso) ? children : alternativa}</>;
}
