import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Slug for heading ids (match rehype-slug style). */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u00c0-\u024f]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
