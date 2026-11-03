import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { esEscritorio, guardarEnEscritorio } from "./escritorio"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function esNumeroDecimalValido(valor: string): boolean {
  return valor === "" || /^\d*\.?\d*$/.test(valor);
}

export function formatearMoneda(valor: number | string | undefined | null): string {
  if (valor === undefined || valor === null || valor === "") return "0.00";
  return Number(valor).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


const descargarEnNavegador = (archivo: Blob, nombre: string) => {
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
  toast.success("Archivo descargado");
};

export async function descargarArchivo(archivo: Blob, nombre: string): Promise<void> {
  if (!esEscritorio()) {
    descargarEnNavegador(archivo, nombre);
    return;
  }

  try {
    const ruta = await guardarEnEscritorio(archivo, nombre);
    if (ruta) toast.success(`Archivo guardado en ${ruta}`);
  } catch (error) {
    toast.error(`No se pudo guardar el archivo: ${error}`);
  }
}

export async function abrirPdf(archivo: Blob, nombre: string): Promise<void> {
  if (esEscritorio()) {
    await descargarArchivo(archivo, nombre);
    return;
  }

  window.open(URL.createObjectURL(archivo), "_blank");
}
