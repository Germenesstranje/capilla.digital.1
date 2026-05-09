import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BookLectern from '@/components/chapel/BookLectern';
import ChapelInterior from '@/components/chapel/ChapelInterior';

export default function Home() {
  const [view, setView] = useState('book'); // 'book' or 'chapel'

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === 'book' ? (
          <BookLectern key="book" onLookUp={() => setView('chapel')} />
        ) : (
          <ChapelInterior key="chapel" onLookDown={() => setView('book')} />
        )}
      </AnimatePresence>
    </div>
  );
}
