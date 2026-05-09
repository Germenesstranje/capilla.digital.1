import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';
import ParchmentModal from './ParchmentModal';

export default function SaintColumn({ saint, isLarge, autoOpen, onClose }) {
  const [showParchment, setShowParchment] = useState(autoOpen || false);
  const [zoomed, setZoomed] = useState(false);

  const imgSrc = IMAGES.saints[saint.image];

  const handleClick = () => {
    if (!zoomed) {
      setZoomed(true);
    } else {
      setShowParchment(true);
    }
  };

  return (
    <>
      <motion.div
        className={`flex flex-col items-center cursor-pointer group ${isLarge ? 'scale-110' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
      >
        <div className={`relative ${isLarge ? 'w-20 md:w-28' : 'w-16 md:w-22'}`}>
          <img
            src={imgSrc}
            alt={saint.name}
            className="w-full h-auto rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
          />
          {!zoomed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors">
              <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity font-body bg-black/40 px-2 py-1 rounded">
                Acercarse
              </span>
            </div>
          )}
        </div>
        <p className="text-xs md:text-sm font-heading text-amber-900 mt-1.5 text-center leading-tight max-w-20">
          {saint.name}
        </p>
      </motion.div>

      {/* Zoomed view */}
      {zoomed && !showParchment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => { setZoomed(false); }}
        >
          <motion.div
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
            onClick={e => { e.stopPropagation(); setShowParchment(true); }}
          >
            <img
              src={imgSrc}
              alt={saint.name}
              className="w-64 md:w-80 h-auto rounded-xl shadow-2xl cursor-pointer"
            />
            <p className="font-heading text-xl text-white mt-4 bg-black/30 px-4 py-2 rounded-full">
              {saint.name}
            </p>
            <p className="text-amber-200 text-sm mt-2 font-body">Toca para ver más</p>
          </motion.div>
        </motion.div>
      )}

      {/* Parchment content */}
      <ParchmentModal
        isOpen={showParchment}
        onClose={() => { setShowParchment(false); setZoomed(false); if (onClose) onClose(); }}
        title={saint.name}
        large={saint.type === 'book'}
      >
        {saint.type === 'image' ? (
          <div className="text-center">
            <a
              href={saint.contentImage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 underline font-body text-lg hover:text-amber-900"
            >
              Ver la Cruz de San Benito
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="whitespace-pre-line text-base md:text-lg">{saint.content}</p>
            {saint.link && (
              <a
                href={saint.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-700 transition-colors font-body"
              >
                Ver video explicativo
              </a>
            )}
          </div>
        )}
      </ParchmentModal>
    </>
  );
}
