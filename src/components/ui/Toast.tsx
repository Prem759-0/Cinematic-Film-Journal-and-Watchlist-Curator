"use client";

import { motion } from 'framer-motion';
import { ToastMessage } from '@/types';
import { cn } from '@/lib/utils';
import { X, Film, CheckCircle, AlertCircle } from 'lucide-react';
import { ANIMATION_SPRING } from '@/lib/constants';

export function Toast({ toast, onClose }: { toast: ToastMessage, onClose: () => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-gold" />,
    error: <AlertCircle className="w-5 h-5 text-rose" />,
    info: <Film className="w-5 h-5 text-secondary" />
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: ANIMATION_SPRING }}
      className={cn(
        "pointer-events-auto flex items-center gap-3 py-3 px-4 bg-surface border border-border shadow-2xl min-w-[280px]"
      )}
    >
      {icons[toast.type]}
      <span className="flex-1 text-sm font-sans text-primary">{toast.message}</span>
      <button 
        onClick={onClose}
        className="text-muted hover:text-gold transition-colors focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
