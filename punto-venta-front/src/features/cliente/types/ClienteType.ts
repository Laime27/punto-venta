export interface ClienteType {
  id: number;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  direccion: string | null;
  nota: string | null;
  created_at?: string;
  updated_at?: string;
}
