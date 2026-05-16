"use client";

import { cn } from '@/lib/utils';

interface GenreChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function GenreChip({ label, selected = false, onClick }: GenreChipProps) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "px-3 py-1 text-xs font-sans rounded-full border transition-all duration-200 whitespace-nowrap",
        selected 
          ? "bg-gold/20 border-gold text-gold-light" 
          : "bg-surface border-border text-secondary hover:border-muted",
        !onClick && "cursor-default hover:border-border"
      )}
    >
      {label}
    </button>
  );
}
