export interface Impresora {
  id: number;
  nombre: string;
  ancho: number;
  created_at: string;
  updated_at: string;
}

export interface ImpresoraPayload {
  nombre: string;
  ancho: number;
}

export interface ImpresoraGuardarResponse {
  message: string;
  data: Impresora;
}

export interface ImpresoraValidacionError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ImpresoraOpcion {
  nombre: string;
  noEncontrada: boolean;
}

// Respuesta de GET /api/list del agente local: nombres de las impresoras instaladas en Windows
export type ImpresorasInstaladasResponse = string[];

export interface AgenteImprimirPayload {
  printerName: string;
  file: Blob;
}

export interface AgenteErrorResponse {
  title?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
