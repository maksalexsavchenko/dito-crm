import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Об'єднує класи Tailwind з коректним вирішенням конфліктів. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
