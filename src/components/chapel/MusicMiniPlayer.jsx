import React from 'react';
import { Pause, Play, Music, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicMiniPlayer({ isVisible, isPlaying, onToggle, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-amber-900/90 backdrop-blur-md text-amber-50 rounded-full px-5 py-3 flex items-center gap-3 shadow-xl"
        >
          <Music className="w-4 h-4 text-amber-300" />
          <span className="text-sm font-body hidden sm:inline">Música de la capilla</span>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-full hover:bg-amber-800 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
