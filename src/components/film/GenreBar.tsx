"use client";

interface GenreBarProps {
  genres: Record<string, number>;
}

export function GenreBar({ genres }: GenreBarProps) {
  const entries = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = Math.max(...entries.map(e => e[1]), 1);

  if (entries.length === 0) return <div className="text-sm text-muted font-sans">No genre data.</div>;

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([genre, count]) => (
        <div key={genre} className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-sans">
            <span className="text-secondary">{genre}</span>
            <span className="text-muted">{count}</span>
          </div>
          <div className="h-1.5 w-full bg-elevated rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-1000 ease-out" 
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
