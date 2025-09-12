import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* Sanitizes a string to be used as a Pinecone namespace by removing
 * all non-ASCII characters. */
export function sanitizeNamespace(input: string) {
  // This regular expression matches any character that is NOT
  // within the standard ASCII range (hexadecimal 00 to 7F).
  return input.replace(/[^\x00-\x7F]/g, "");
}
