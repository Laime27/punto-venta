import { useVerificarSesion } from "./useVerificarSesion";
import type { Permiso } from "../types/AuthType";

export type RequisitoPermiso = Permiso | Permiso[];

export const usePermisos = () => {
  const { sesion } = useVerificarSesion();
  const permisos = new Set<Permiso>(sesion?.permisos ?? []);

  const puede = (requisito?: RequisitoPermiso) => {
    if (!requisito) return true;
    const requeridos = Array.isArray(requisito) ? requisito : [requisito];
    return requeridos.some((permiso) => permisos.has(permiso));
  };

  return {
    usuario: sesion?.user ?? null,
    rol: sesion?.rol ?? null,
    puede,
  };
};
