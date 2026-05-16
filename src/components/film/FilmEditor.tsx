"use client";

import { useState, useEffect } from 'react';
import { FilmEntry } from '@/types';
import { GENRES, MOOD_COLORS } from '@/lib/constants';
import { generateId, getMoodGradient, cn } from '@/lib/utils';
import { StarRating } from './StarRating';
import { GenreChip } from './GenreChip';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';

interface FilmEditorProps {
  initialFilm?: FilmEntry | null;
  onSave: (film: FilmEntry) => void;
  onClose: () => void;
}

export function FilmEditor({ initialFilm, onSave, onClose }: FilmEditorProps) {
  const [title, setTitle] = useState(initialFilm?.title || '');
  const [year, setYear] = useState(initialFilm?.year?.toString() || '');
  const [director, setDirector] = useState(initialFilm?.director || '');
  const [genres, setGenres] = useState<string[]>(initialFilm?.genres || []);
  const [rating, setRating] = useState(initialFilm?.rating || 0);
  const [review, setReview] = useState(initialFilm?.review || '');
  const [status, setStatus] = useState<'watched'|'watchlist'>(initialFilm?.status || 'watched');
  const [watchDate, setWatchDate] = useState(initialFilm?.watchDate ? initialFilm.watchDate.split('T')[0] : '');
  const [moodColor, setMoodColor] = useState(initialFilm?.moodColor || MOOD_COLORS[0].key);
  const [error, setError] = useState('');

  const toggleGenre = (g: string) => {
    setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !director.trim()) {
      setError('Title and Director are required.');
      return;
    }
    const numYear = parseInt(year);
    if (year && (isNaN(numYear) || numYear < 1888 || numYear > 2100)) {
      setError('Please enter a valid year.');
      return;
    }

    const entry: FilmEntry = {
      id: initialFilm?.id || generateId(),
      title: title.trim(),
      year: year ? numYear : null,
      director: director.trim(),
      genres,
      rating: status === 'watchlist' ? 0 : rating,
      review: review.trim(),
      status,
      watchDate: status === 'watched' && watchDate ? new Date(watchDate).toISOString() : null,
      moodColor,
      createdAt: initialFilm?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(entry);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-base/80 backdrop-blur-sm" onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-surface h-full border-l border-border overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className={cn("h-32 shrink-0 bg-gradient-to-br opacity-80", getMoodGradient(moodColor))} />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={onClose} className="p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-6 font-sans">
          <h2 className="text-3xl font-serif text-primary -mt-16 relative z-10 drop-shadow-md">
            {initialFilm ? 'Edit Journal Entry' : 'Log a Film'}
          </h2>

          {error && <div className="text-rose text-sm bg-rose/10 p-3 rounded-md">{error}</div>}

          <div className="flex flex-col gap-4">
            <input
              type="text" placeholder="Film Title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-b border-border text-2xl font-serif text-primary focus:outline-none focus:border-gold pb-2 transition-colors placeholder:text-muted"
              autoFocus
            />
            
            <div className="flex gap-4">
              <input
                type="text" placeholder="Director" value={director} onChange={(e) => setDirector(e.target.value)}
                className="flex-1 bg-elevated border border-border p-3 text-primary text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <input
                type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)}
                className="w-24 bg-elevated border border-border p-3 text-primary text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-secondary uppercase tracking-widest mb-3 block">Status</label>
            <div className="flex gap-2 p-1 bg-elevated border border-border rounded-md">
              <button
                type="button" onClick={() => setStatus('watched')}
                className={cn("flex-1 py-2 text-sm transition-colors rounded-sm", status === 'watched' ? "bg-surface text-gold shadow-sm" : "text-muted hover:text-primary")}
              >Watched</button>
              <button
                type="button" onClick={() => setStatus('watchlist')}
                className={cn("flex-1 py-2 text-sm transition-colors rounded-sm", status === 'watchlist' ? "bg-surface text-gold shadow-sm" : "text-muted hover:text-primary")}
              >Watchlist</button>
            </div>
          </div>

          <AnimatePresence>
            {status === 'watched' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-6 overflow-hidden">
                <div>
                  <label className="text-xs text-secondary uppercase tracking-widest mb-3 block">Rating</label>
                  <StarRating rating={rating} interactive onChange={setRating} size="lg" />
                </div>
                
                <div>
                  <label className="text-xs text-secondary uppercase tracking-widest mb-3 block">Watch Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="date" value={watchDate} onChange={(e) => setWatchDate(e.target.value)}
                      className="w-full bg-elevated border border-border p-3 pl-10 text-primary text-sm focus:outline-none focus:border-gold transition-colors style-calendar"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-secondary uppercase tracking-widest mb-3 block">Review</label>
                  <textarea
                    placeholder="Write your thoughts..." value={review} onChange={(e) => setReview(e.target.value)}
                    className="w-full h-32 bg-elevated border border-border p-3 text-primary text-sm resize-none focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-xs text-secondary uppercase tracking-widest mb-3 block">Genres</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => (
                <GenreChip key={g} label={g} selected={genres.includes(g)} onClick={() => toggleGenre(g)} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-secondary uppercase tracking-widest mb-3 block">Color Mood</label>
            <div className="grid grid-cols-6 gap-2">
              {MOOD_COLORS.map(mood => (
                <button
                  key={mood.key} type="button" onClick={() => setMoodColor(mood.key)} title={mood.label}
                  className={cn("h-10 rounded-sm bg-gradient-to-br transition-all", mood.class, moodColor === mood.key ? "ring-2 ring-gold ring-offset-2 ring-offset-surface scale-110" : "opacity-60 hover:opacity-100")}
                />
              ))}
            </div>
          </div>

          <div className="pt-6 mt-auto flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm text-secondary hover:text-primary transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 text-sm bg-gold text-base font-medium hover:bg-gold-light transition-colors rounded-sm">Save Entry</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
