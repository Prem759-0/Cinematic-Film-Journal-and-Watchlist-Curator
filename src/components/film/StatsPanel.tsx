"use client";

import { FilmStats } from '@/types';
import { GenreBar } from './GenreBar';
import { Star, Film, Eye, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsPanel({ stats }: { stats: FilmStats }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="w-full lg:w-80 shrink-0 flex flex-col gap-6"
    >
      <div className="bg-surface border border-border p-6 rounded-sm">
        <h3 className="font-serif text-lg text-gold mb-6 uppercase tracking-widest text-sm">Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatBox icon={<Eye/>} label="Watched" value={stats.totalWatched} />
          <StatBox icon={<Clock/>} label="Watchlist" value={stats.totalWatchlist} />
          <StatBox icon={<Film/>} label="Total Films" value={stats.totalFilms} />
          <StatBox icon={<Star/>} label="Avg Rating" value={stats.averageRating} isRating />
        </div>
      </div>

      <div className="bg-surface border border-border p-6 rounded-sm">
        <h3 className="font-serif text-lg text-gold mb-6 uppercase tracking-widest text-sm">Top Genres</h3>
        <GenreBar genres={stats.genreBreakdown} />
      </div>

      {stats.topRated && (
        <div className="bg-surface border border-border p-6 rounded-sm">
          <h3 className="font-serif text-lg text-gold mb-4 uppercase tracking-widest text-sm">Highest Rated</h3>
          <div className="font-serif text-xl text-primary mb-1">{stats.topRated.title}</div>
          <div className="text-xs font-sans text-secondary">{stats.topRated.director} • {stats.topRated.year}</div>
        </div>
      )}
    </motion.div>
  );
}

function StatBox({ icon, label, value, isRating }: any) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-elevated/50 rounded-sm">
      <div className="flex items-center gap-1.5 text-muted text-xs font-sans uppercase tracking-wider">
        {icon && <span className="[&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
        {label}
      </div>
      <div className="text-2xl font-serif text-primary flex items-baseline gap-1">
        {value} {isRating && <span className="text-sm text-gold">★</span>}
      </div>
    </div>
  );
}
