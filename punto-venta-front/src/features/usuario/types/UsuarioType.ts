export interface UsuarioType {
  id: number;
  name: string;
  email: string;
  activo?: boolean;
  rol?: { id: number; nombre: string } | null;
  created_at?: string;
}

export interface UsuarioPayload {
  name: string;
  email: string;
  password?: string;
  rol_id: number;
}

export type FiltroActivo = "todos" | "1" | "0";

export interface FiltrosUsuarioType {
  search: string;
  rol_id: number | null;
  activo: FiltroActivo;
  per_page: number;
}

export interface UsuarioPaginadoType {
  data: UsuarioType[];
  current_page: number;
  last_page: number;
  total: number;
}
