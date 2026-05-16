"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FilmEntry, FilmStats } from '@/types';
import { STORAGE_KEY, SEED_FLAG_KEY } from '@/lib/constants';
import { seedFilms } from '@/data/seedProject2';

export function useFilmJournal() {
  const [films, setFilms] = useState<FilmEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const isSeeded = localStorage.getItem(SEED_FLAG_KEY);
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (!isSeeded || !stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedFilms));
        localStorage.setItem(SEED_FLAG_KEY, 'true');
        setFilms(seedFilms);
      } else {
        setFilms(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load films:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveFilms = useCallback((newFilms: FilmEntry[]) => {
    setFilms(newFilms);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilms));
    } catch (e) {
      console.error("Failed to save films:", e);
    }
  }, []);

  const addFilm = useCallback((film: FilmEntry) => {
    saveFilms([film, ...films]);
  }, [films, saveFilms]);

  const updateFilm = useCallback((updated: FilmEntry) => {
    saveFilms(films.map(f => f.id === updated.id ? updated : f));
  }, [films, saveFilms]);

  const deleteFilm = useCallback((id: string) => {
    saveFilms(films.filter(f => f.id !== id));
  }, [films, saveFilms]);

  const stats: FilmStats = useMemo(() => {
    const watched = films.filter(f => f.status === 'watched');
    const watchlist = films.filter(f => f.status === 'watchlist');
    
    const ratingSum = watched.reduce((acc, f) => acc + f.rating, 0);
    const avgRating = watched.length ? +(ratingSum / watched.length).toFixed(1) : 0;
    
    const genres: Record<string, number> = {};
    watched.forEach(f => {
      f.genres.forEach(g => { genres[g] = (genres[g] || 0) + 1; });
    });

    const sortedWatched = [...watched].sort((a, b) => {
      return new Date(b.watchDate || 0).getTime() - new Date(a.watchDate || 0).getTime();
    });

    const topRated = [...watched].sort((a, b) => b.rating - a.rating)[0] || null;

    return {
      totalFilms: films.length,
      totalWatched: watched.length,
      totalWatchlist: watchlist.length,
      averageRating: avgRating,
      genreBreakdown: genres,
      topRated,
      mostRecent: sortedWatched[0] || null
    };
  }, [films]);

  return {
    films,
    isLoaded,
    addFilm,
    updateFilm,
    deleteFilm,
    stats
  };
}
