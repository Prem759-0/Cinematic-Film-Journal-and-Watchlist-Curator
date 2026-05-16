"use client";

import { useEffect } from 'react';

type ShortcutMap = {
  [key: string]: (e: KeyboardEvent) => void;
};

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key !== 'Escape') return; 
      }
      
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      
      if (shortcuts[key]) {
        shortcuts[key](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
