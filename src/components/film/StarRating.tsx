"use client";

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, interactive = false, onChange, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!interactive || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  const handleClick = () => {
    if (interactive && onChange && hoverRating !== null) {
      onChange(hoverRating);
    }
  };

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div 
      className="flex items-center gap-1"
      onMouseLeave={() => setHoverRating(null)}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fillPercent = Math.max(0, Math.min(100, (displayRating - index) * 100));
        
        return (
          <div
            key={index}
            className={cn("relative cursor-pointer text-border transition-transform", interactive && "hover:scale-110")}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={handleClick}
          >
            <Star className={cn(sizes[size], "fill-current stroke-current")} />
            {fillPercent > 0 && (
              <div 
                className="absolute top-0 left-0 overflow-hidden text-gold"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={cn(sizes[size], "fill-current stroke-current")} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
