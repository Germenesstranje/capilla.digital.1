import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

export default function GardenView({ onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `url(${IMAGES.garden})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/10" />

      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors text-green-900 font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la capilla
      </button>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-8 max-w-md shadow-xl"
        >
          <h2 className="font-heading text-2xl text-green-900 mb-3">Jardín de la Paz</h2>
          <p className="font-body text-green-800 leading-relaxed">
            Un lugar de serenidad donde la naturaleza refleja la belleza de la Creación. 
            La fuente murmura suavemente, las flores danzan con la brisa, y la luz del sol 
            baña todo con calidez divina.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
