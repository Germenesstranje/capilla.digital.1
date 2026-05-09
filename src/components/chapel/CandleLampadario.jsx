import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

const CANDLE_COLORS = [
  '#FFF8DC', '#FFE4B5', '#FADADD', '#E6E6FA', '#D4F1D4',
  '#F0E68C', '#B0E0E6', '#FFE4E1', '#E0BBE4', '#C5E1A5',
  '#FFFACD', '#F5DEB3', '#DDA0DD', '#ADD8E6', '#F0FFF0',
  '#FFEFD5', '#E8D8C4', '#D4E6F1', '#F9E79F', '#FADBD8',
  '#FFF5EE', '#E0E0E0', '#FFFAF0', '#F0F8FF', '#F5F5DC',
];

export default function CandleLampadario({ isOpen, onClose }) {
  const [litCandles, setLitCandles] = useState(() => {
    const saved = localStorage.getItem('litCandles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('litCandles', JSON.stringify(litCandles));
  }, [litCandles]);

  const toggleCandle = (index) => {
    setLitCandles(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="relative max-w-lg w-full bg-amber-950/90 rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={IMAGES.lampadario}
          alt="Lampadario y pesebre"
          className="w-40 h-40 object-contain mx-auto mb-4 rounded-xl"
        />
        <h3 className="font-heading text-xl text-amber-200 text-center mb-2">
          Lampadario del Pesebre
        </h3>
        <p className="text-amber-300/80 text-center text-sm font-body mb-4">
          Toca una vela para encenderla
        </p>

        <div className="grid grid-cols-5 gap-3 justify-items-center">
          {CANDLE_COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => toggleCandle(i)}
              className="relative flex flex-col items-center"
            >
              {/* Flame */}
              {litCandles.includes(i) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-4 rounded-full animate-flicker mb-0.5"
                  style={{
                    background: 'radial-gradient(ellipse, #FFD700, #FF8C00, transparent)',
                    boxShadow: `0 0 8px 3px ${color}44, 0 0 20px 6px #FFD70033`,
                  }}
                />
              )}
              {/* Candle body */}
              <div
                className="w-4 h-10 rounded-t-sm rounded-b-md border border-white/20 transition-all"
                style={{
                  backgroundColor: color,
                  opacity: litCandles.includes(i) ? 1 : 0.5,
                  boxShadow: litCandles.includes(i)
                    ? `0 0 12px 4px ${color}66`
                    : 'none',
                }}
              />
            </button>
          ))}
        </div>

        <p className="text-amber-400/60 text-center text-xs font-body mt-4">
          {litCandles.length} vela{litCandles.length !== 1 ? 's' : ''} encendida{litCandles.length !== 1 ? 's' : ''}
        </p>
      </motion.div>
    </motion.div>
  );
}
