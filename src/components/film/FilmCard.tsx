"use client";

import { FilmEntry } from '@/types';
import { StarRating } from './StarRating';
import { getMoodGradient, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FilmCardProps {
  film: FilmEntry;
  onClick: () => void;
}

export function FilmCard({ film, onClick }: FilmCardProps) {
  const gradientClass = getMoodGradient(film.moodColor);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group cursor-pointer relative aspect-video rounded-md overflow-hidden border border-border/50 shadow-lg"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100", gradientClass)} />
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-0 group-hover:bg-black/20" />
      
      <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <div className="flex justify-between items-end gap-2">
          <div className="flex flex-col">
            <h3 className="font-serif text-lg text-primary leading-tight line-clamp-1 group-hover:text-gold-light transition-colors">
              {film.title}
            </h3>
            <p className="text-xs text-secondary/80 font-sans mt-1">
              {film.year} • {film.director}
            </p>
          </div>
          {film.status === 'watched' ? (
            <div className="mb-1 shrink-0">
              <StarRating rating={film.rating} size="sm" />
            </div>
          ) : (
            <span className="text-[10px] uppercase tracking-widest text-gold/80 border border-gold/30 px-1.5 py-0.5 rounded-sm shrink-0">
              Watchlist
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
