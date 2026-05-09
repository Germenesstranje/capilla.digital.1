import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

export default function OrganView({ onBack, onMusicStarted }) {
  React.useEffect(() => {
    onMusicStarted();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-amber-50"
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors text-amber-900 font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la capilla
      </button>

      <div className="w-full max-w-3xl mx-auto px-4">
        <img
          src={IMAGES.organ}
          alt="Órgano"
          className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto mb-6 rounded-xl"
        />
        <h2 className="font-heading text-2xl md:text-3xl text-amber-900 text-center mb-6">
          Órgano de la Capilla
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <iframe
            src="https://open.spotify.com/embed/playlist/2r4eLTMx0dKiuzBD3PF3a3?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        </div>
        <p className="text-center mt-3 font-body text-sm text-amber-700">
          Si el reproductor no carga, <a href="https://open.spotify.com/playlist/2r4eLTMx0dKiuzBD3PF3a3" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">abrilo en Spotify</a>
        </p>
      </div>
    </motion.div>
  );
}
