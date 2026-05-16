"use client";

import { FilmEntry } from '@/types';
import { getMoodGradient, formatDate, cn } from '@/lib/utils';
import { StarRating } from './StarRating';
import { GenreChip } from './GenreChip';
import { motion } from 'framer-motion';
import { X, Edit2, Trash2, Calendar } from 'lucide-react';

interface FilmDetailProps {
  film: FilmEntry;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function FilmDetail({ film, onEdit, onDelete, onClose }: FilmDetailProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-base/90 backdrop-blur-sm" onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden max-h-full rounded-md"
      >
        <div className={cn("h-48 shrink-0 bg-gradient-to-br relative", getMoodGradient(film.moodColor))}>
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={onEdit} className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"><Edit2 className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-2 bg-black/40 text-rose rounded-full hover:bg-rose hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors ml-2"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-6 md:p-10 -mt-20 relative z-10 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-primary drop-shadow-md leading-tight">{film.title}</h1>
            <div className="flex items-center gap-4 text-secondary font-sans text-sm mt-2">
              <span>{film.year}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Directed by <span className="text-primary">{film.director}</span></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 mb-10 border-b border-border pb-8">
            <div className="flex gap-2 flex-wrap">
              {film.genres.map(g => <GenreChip key={g} label={g} />)}
            </div>
            
            {film.status === 'watched' ? (
              <div className="flex flex-col items-end gap-2">
                <StarRating rating={film.rating} size="lg" />
                {film.watchDate && (
                  <span className="flex items-center gap-1.5 text-xs text-muted font-sans uppercase tracking-widest">
                    <Calendar className="w-3 h-3" /> Watched {formatDate(film.watchDate)}
                  </span>
                )}
              </div>
            ) : (
              <span className="px-4 py-1.5 border border-gold text-gold font-sans text-sm tracking-widest uppercase rounded-sm">
                In Watchlist
              </span>
            )}
          </div>

          {film.review && (
            <div className="font-serif text-lg leading-relaxed text-primary/90 whitespace-pre-wrap pl-6 border-l-2 border-gold/30">
              "{film.review}"
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
