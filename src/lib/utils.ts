import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { MOOD_COLORS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

export function formatDate(isoString: string | null): string {
  if (!isoString) return 'Unknown date';
  try {
    return format(parseISO(isoString), "MMMM d, yyyy");
  } catch {
    return 'Invalid date';
  }
}

export function getMoodGradient(moodKey: string): string {
  const mood = MOOD_COLORS.find(m => m.key === moodKey);
  return mood ? mood.class : MOOD_COLORS[0].class;
}

export function downloadJson(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
