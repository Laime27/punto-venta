import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Ocurrió un error inesperado"): string {
  if (!isAxiosError(error)) return fallback;

  const data = error.response?.data;

  const errors = data?.errors;
  if (errors && typeof errors === "object") {
    const primerMensaje = Object.values(errors).flat()[0];
    if (primerMensaje && typeof primerMensaje === "string") return primerMensaje;
  }

  const errores = data?.errores;
  if (Array.isArray(errores) && errores.length > 0) {
    const primerError = errores[0];
    if (typeof primerError === "string") return primerError;
    if (primerError?.errores && Array.isArray(primerError.errores) && primerError.errores.length > 0) {
      const detalle = primerError.errores[0];
      const fila = primerError.fila ? `Fila ${primerError.fila}: ` : "";
      return `${fila}${detalle}`;
    }
  }

  return data?.mensaje ?? data?.message ?? fallback;
}
