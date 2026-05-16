"use client";

import { useState, useEffect } from 'react';
import { useFilmJournal } from '@/hooks/useFilmJournal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/components/ui/ToastProvider';
import { FilmEntry } from '@/types';
import { downloadJson } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { FilmCard } from '@/components/film/FilmCard';
import { FilmEditor } from '@/components/film/FilmEditor';
import { FilmDetail } from '@/components/film/FilmDetail';
import { StatsPanel } from '@/components/film/StatsPanel';
import { FilterBar } from '@/components/film/FilterBar';
import { RandomPicker } from '@/components/film/RandomPicker';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Plus, Download } from 'lucide-react';

export default function FilmJournalApp() {
  const { films, isLoaded, addFilm, updateFilm, deleteFilm, stats } = useFilmJournal();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'library'|'watchlist'|'stats'>('library');
  const [editingFilm, setEditingFilm] = useState<FilmEntry | null | undefined>(undefined);
  const [viewingFilm, setViewingFilm] = useState<FilmEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useKeyboardShortcuts({
    'N': (e) => { e.preventDefault(); setEditingFilm(null); },
  });

  const handleSave = (film: FilmEntry) => {
    if (editingFilm) {
      updateFilm(film);
      addToast('Film updated successfully', 'success');
    } else {
      addFilm(film);
      addToast('Film added to journal', 'success');
    }
    setEditingFilm(undefined);
    if (viewingFilm) setViewingFilm(film);
  };

  const executeDelete = () => {
    if (deleteConfirmId) {
      deleteFilm(deleteConfirmId);
      addToast('Film removed from journal', 'info');
      if (viewingFilm?.id === deleteConfirmId) setViewingFilm(null);
    }
    setDeleteConfirmId(null);
  };

  const handleExport = () => {
    downloadJson(films, `film_journal_export_${new Date().toISOString().split('T')[0]}.json`);
    addToast('Data exported successfully', 'success');
  };

  if (!mounted || !isLoaded) return null;

  const displayFilms = films.filter(f => {
    if (activeTab === 'library' && f.status !== 'watched') return false;
    if (activeTab === 'watchlist' && f.status !== 'watchlist') return false;
    if (search && !f.title.toLowerCase().includes(search.toLowerCase()) && !f.director.toLowerCase().includes(search.toLowerCase())) return false;
    if (genreFilter && !f.genres.includes(genreFilter)) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-base/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl text-gold tracking-wide">Cinémathèque</h1>
          <div className="flex items-center gap-4">
            <button onClick={handleExport} className="hidden md:flex items-center gap-2 text-sm font-sans text-secondary hover:text-primary transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setEditingFilm(null)} className="flex items-center gap-2 bg-gold text-base font-sans font-medium px-4 py-2 hover:bg-gold-light transition-colors rounded-sm">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Log Film</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-12 w-full">
        
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-border mb-8">
            {(['library', 'watchlist', 'stats'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(''); setGenreFilter(null); }}
                className={`pb-4 font-sans uppercase tracking-widest text-sm transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-muted hover:text-secondary'}`}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'stats' ? (
              <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden">
                <StatsPanel stats={stats} />
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                
                {activeTab === 'library' && (
                  <FilterBar search={search} setSearch={setSearch} activeGenre={genreFilter} setGenre={setGenreFilter} />
                )}

                {activeTab === 'watchlist' && (
                  <div className="mb-6">
                    <RandomPicker watchlist={films.filter(f => f.status === 'watchlist')} onSelect={setViewingFilm} />
                  </div>
                )}

                {displayFilms.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center font-serif text-secondary border border-dashed border-border">
                    <p className="text-2xl mb-2">No films found.</p>
                    <p className="font-sans text-sm text-muted">Adjust your filters or add a new entry.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {displayFilms.map(film => (
                        <FilmCard key={film.id} film={film} onClick={() => setViewingFilm(film)} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar (Stats - Desktop only) */}
        <div className="hidden lg:block">
          <StatsPanel stats={stats} />
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {editingFilm !== undefined && (
          <FilmEditor initialFilm={editingFilm} onSave={handleSave} onClose={() => setEditingFilm(undefined)} />
        )}
        {viewingFilm && !editingFilm && (
          <FilmDetail 
            film={viewingFilm} 
            onClose={() => setViewingFilm(null)} 
            onEdit={() => setEditingFilm(viewingFilm)}
            onDelete={() => setDeleteConfirmId(viewingFilm.id)}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={!!deleteConfirmId}
        title="Remove Film?"
        message="Are you sure you want to delete this entry from your journal? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
