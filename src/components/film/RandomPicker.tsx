"use client";

import { useState } from 'react';
import { FilmEntry } from '@/types';
import { Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RandomPickerProps {
  watchlist: FilmEntry[];
  onSelect: (film: FilmEntry) => void;
}

export function RandomPicker({ watchlist, onSelect }: RandomPickerProps) {
  const [isPicking, setIsPicking] = useState(false);
  const [displayTitle, setDisplayTitle] = useState('Pick Random Film');

  const handlePick = () => {
    if (watchlist.length === 0) return;
    setIsPicking(true);
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const randomFilm = watchlist[Math.floor(Math.random() * watchlist.length)];
      setDisplayTitle(randomFilm.title);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsPicking(false);
        onSelect(randomFilm);
        setDisplayTitle('Pick Random Film');
      }
    }, 50);
  };

  if (watchlist.length === 0) return null;

  return (
    <button
      onClick={handlePick}
      disabled={isPicking}
      className="flex items-center justify-center gap-2 w-full py-4 bg-surface border border-gold/30 text-gold hover:bg-gold/10 transition-colors font-sans uppercase tracking-widest text-sm disabled:opacity-50"
    >
      <Shuffle className={`w-4 h-4 ${isPicking ? 'animate-spin' : ''}`} />
      <span className="w-48 text-center truncate">{displayTitle}</span>
    </button>
  );
}
