import type { ReactNode } from "react";
import { usePermisos, type RequisitoPermiso } from "@/features/auth/hooks/usePermisos";
import { SinAcceso } from "@/features/auth/components/SinAcceso";

interface Props {
  permiso: RequisitoPermiso;
  children: ReactNode;
}

interface AdministradorProps {
  children: ReactNode;
}

export function PermisoRoute({ permiso, children }: Props) {
  const { puede } = usePermisos();
  return <>{puede(permiso) ? children : <SinAcceso />}</>;
}

export function AdministradorRoute({ children }: AdministradorProps) {
  const { esAdministrador } = usePermisos();
  return <>{esAdministrador ? children : <SinAcceso />}</>;
}
