"use client";

import { Search } from 'lucide-react';
import { GENRES } from '@/lib/constants';

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  activeGenre: string | null;
  setGenre: (val: string | null) => void;
}

export function FilterBar({ search, setSearch, activeGenre, setGenre }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search films or directors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-elevated border border-border p-2.5 pl-10 text-primary text-sm font-sans focus:outline-none focus:border-gold transition-colors rounded-sm placeholder:text-muted"
        />
      </div>
      <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-2 pb-2 md:pb-0">
        <button
          onClick={() => setGenre(null)}
          className={`px-3 py-1 text-xs font-sans whitespace-nowrap rounded-full border transition-colors ${!activeGenre ? 'bg-gold/20 border-gold text-gold-light' : 'bg-surface border-border text-secondary hover:border-muted'}`}
        >
          All
        </button>
        {GENRES.slice(0, 8).map(g => (
          <button
            key={g}
            onClick={() => setGenre(g === activeGenre ? null : g)}
            className={`px-3 py-1 text-xs font-sans whitespace-nowrap rounded-full border transition-colors ${g === activeGenre ? 'bg-gold/20 border-gold text-gold-light' : 'bg-surface border-border text-secondary hover:border-muted'}`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
