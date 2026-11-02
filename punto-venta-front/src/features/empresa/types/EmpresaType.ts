export interface Empresa {
  id: number;
  nombre: string;
  ruc: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  logo: string | null;
  moneda_simbolo: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface EmpresaGuardarResponse {
  message: string;
  data: Empresa;
}

export interface EmpresaValidacionError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ZonaHorariaOpcion {
  value: string;
  label: string;
  offset: number;
}
