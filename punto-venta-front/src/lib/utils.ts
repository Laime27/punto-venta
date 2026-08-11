import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function esNumeroDecimalValido(valor: string): boolean {
  return valor === "" || /^\d*\.?\d*$/.test(valor);
}
