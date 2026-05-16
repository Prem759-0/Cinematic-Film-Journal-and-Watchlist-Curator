export interface FilmEntry {
  id: string;
  title: string;
  year: number | null;
  director: string;
  genres: string[];
  rating: number; 
  review: string;
  watchDate: string | null; 
  status: 'watched' | 'watchlist';
  moodColor: string; 
  createdAt: string;
  updatedAt: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Added the missing ToastContextType here
export interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export interface FilmStats {
  totalFilms: number;
  totalWatched: number;
  totalWatchlist: number;
  averageRating: number;
  genreBreakdown: Record<string, number>;
  topRated: FilmEntry | null;
  mostRecent: FilmEntry | null;
}
