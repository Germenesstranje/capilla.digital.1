import React from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

export default function HolyWaterView({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={IMAGES.holyWater}
          alt="Agua Bendita"
          className="w-48 h-48 object-contain mx-auto mb-4"
        />
        {/* Bowl top view */}
        <div
          className="relative w-64 h-64 mx-auto rounded-full overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #f5f5f0 0%, #e8e0d0 30%, #d4ccc0 100%)',
          }}
        >
          {/* Water surface */}
          <div
            className="absolute inset-4 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(200,220,240,0.7) 0%, rgba(180,200,220,0.5) 50%, rgba(160,180,200,0.3) 100%)',
            }}
          >
            {/* Marble veins under water */}
            <div className="absolute inset-0 rounded-full opacity-30">
              <div className="absolute top-1/4 left-1/4 w-32 h-px bg-gray-400 rotate-45" />
              <div className="absolute top-1/2 left-1/3 w-24 h-px bg-gray-300 -rotate-12" />
              <div className="absolute top-2/3 left-1/2 w-20 h-px bg-gray-400 rotate-30" />
            </div>
            
            {/* Inscription at bottom */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-heading text-sm text-gray-600/60 text-center px-6 leading-relaxed italic">
                "Gratis lo recibisteis, dadlo gratis"
              </p>
            </div>

            {/* Water shimmer */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-white/20"
            />
          </div>
        </div>

        <p className="text-center text-white/80 font-body text-sm mt-4">
          Cuenco de mármol Carrara — Agua Bendita
        </p>
      </motion.div>
    </motion.div>
  );
}
