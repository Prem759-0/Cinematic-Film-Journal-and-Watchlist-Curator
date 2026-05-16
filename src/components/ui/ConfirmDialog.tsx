"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_SPRING } from '@/lib/constants';
import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-base/90 backdrop-blur-sm z-40"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ ease: ANIMATION_SPRING, duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-surface border border-border w-full max-w-sm p-6 pointer-events-auto shadow-2xl">
              <h2 className="text-xl font-serif text-primary mb-2">{title}</h2>
              <p className="text-secondary text-sm font-sans mb-8 leading-relaxed">{message}</p>
              <div className="flex justify-end gap-3 font-sans">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm bg-rose/10 text-rose border border-rose/30 hover:bg-rose hover:text-white transition-colors focus:outline-none"
                >
                  Delete Film
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
