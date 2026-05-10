import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

export default function ParchmentModal({ isOpen, onClose, title, children, large }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative ${large ? 'max-w-4xl' : 'max-w-2xl'} w-full max-h-[85vh] overflow-hidden rounded-lg`}
            onClick={e => e.stopPropagation()}
            style={{
              backgroundImage: `url(${IMAGES.parchment})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-amber-50/80 rounded-lg" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-amber-200/50">
                <h2 className="font-heading text-xl md:text-2xl text-amber-900 font-semibold">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-amber-200/50 transition-colors text-amber-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh] font-body text-amber-950 leading-relaxed">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
