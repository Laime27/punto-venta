import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

