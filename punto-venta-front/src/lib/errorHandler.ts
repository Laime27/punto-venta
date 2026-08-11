import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Ocurrió un error inesperado"): string {
  if (!isAxiosError(error)) return fallback;

  const data = error.response?.data;

  const errores = data?.errors;
  if (errores) {
    const primerMensaje = Object.values(errores).flat()[0];
    if (primerMensaje) return primerMensaje as string;
  }

  return data?.message ?? fallback;
}
