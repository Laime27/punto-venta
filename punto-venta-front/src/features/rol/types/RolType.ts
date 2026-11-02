export interface RolListadoType {
  id: number;
  name: string;
  descripcion: string | null;
  usuarios: number;
  permisos: number;
  es_administrador: boolean;
}

export interface RolDetalleType {
  id: number;
  name: string;
  descripcion: string | null;
  es_administrador: boolean;
  permisos: number[];
}

export interface PermisoType {
  id: number;
  name: string;
  descripcion: string;
}

export interface GrupoPermisosType {
  id: number;
  nombre: string;
  permisos: PermisoType[];
}

export interface RolPayload {
  name: string;
  descripcion: string | null;
  permisos: number[];
}

export interface RolSelectType {
  id: number;
  nombre: string;
}
