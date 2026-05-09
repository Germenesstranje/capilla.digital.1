import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { IMAGES, SAINTS_LEFT, SAINTS_RIGHT, CRISTO_REY, BELL_TOWER_TEXT } from '@/lib/constants';
import SaintColumn from './SaintColumn';
import OrganView from './OrganView';
import LibraryView from './LibraryView';
import CandleLampadario from './CandleLampadario';
import GardenView from './GardenView';
import HolyWaterView from './HolyWaterView';
import ParchmentModal from './ParchmentModal';
import MusicMiniPlayer from './MusicMiniPlayer';
import VisitorCounter from './VisitorCounter';

const CHAPEL_IMAGE = 'https://media.base44.com/images/public/69ff3c2eb66d50453d260fdb/b10a9e2ed_WhatsAppImage2026-05-07at102827PM.jpg';

// Hotspots — x/y/w/h as % of image width/height (16:9)
// Carefully mapped against the chapel illustration
const HOTSPOTS = [
  // ── TOP AREA ──
  // Bell: tiny bronze bell hanging at apex of roof
  { id: 'bell',         label: 'Campana',               x: 46,   y: 0,    w: 8,    h: 10  },
  // Benedict circular medallion, center-high wall
  { id: 'benedict',     label: 'Escudo San Benito',      x: 44,   y: 9,    w: 12,   h: 12  },

  // ── LEFT WALL VITRAUX (two tall arched windows) ──
  // Far-left window (Creation/Adam)
  { id: 'vitraux_cl',   label: 'Vitral: Creación',       x: 0,    y: 2,    w: 10,   h: 52  },
  // Inner-left window (Annunciation)
  { id: 'vitraux_an',   label: 'Vitral: Anunciación',    x: 10,   y: 4,    w: 11,   h: 48  },

  // ── RIGHT WALL VITRAUX ──
  // Inner-right window (Transfiguration)
  { id: 'vitraux_tr',   label: 'Vitral: Transfiguración',x: 79,   y: 4,    w: 11,   h: 48  },
  // Far-right window (Last Supper)
  { id: 'vitraux_ls',   label: 'Vitral: Última Cena',    x: 90,   y: 2,    w: 10,   h: 52  },

  // ── BOTTOM-LEFT: ORGAN + LIBRARY ──
  // Organ (pipes visible, keyboard at bottom-left)
  { id: 'organ',        label: 'Órgano',                 x: 0,    y: 55,   w: 10,   h: 45  },
  // Library bookshelf (right of organ)
  { id: 'library',      label: 'Biblioteca',             x: 10,   y: 60,   w: 10,   h: 40  },

  // ── SAINTS LEFT (outermost→ center) ──
  // Virgen de Luján: small statue, far-left mid-height
  { id: 'saint_vl',     label: 'Virgen de Luján',        x: 2,    y: 42,   w: 8,    h: 35  },
  // San José: on pedestal
  { id: 'saint_sj',     label: 'San José',               x: 13,   y: 34,   w: 9,    h: 40  },
  // San Miguel: tallest left saint, wings
  { id: 'saint_sm',     label: 'San Miguel Arcángel',    x: 22,   y: 24,   w: 10,   h: 50  },
  // Sto. Tomás: closest to arch on left
  { id: 'saint_st',     label: 'Sto. Tomás de Aquino',   x: 32,   y: 20,   w: 9,    h: 52  },

  // ── CENTER ──
  // Cristo Rey: statue just left of arch opening
  { id: 'cristo',       label: 'Cristo Rey',             x: 40,   y: 18,   w: 7,    h: 56  },
  // Garden arch: the open doorway (starts below the "Ciudad de Dios" sign)
  { id: 'garden',       label: 'Jardín de la Paz',       x: 46,   y: 28,   w: 12,   h: 52  },

  // ── SAINTS RIGHT (center→ outermost) ──
  // San Agustín: closest to arch on right
  { id: 'saint_sa',     label: 'San Agustín de Hipona',  x: 57,   y: 20,   w: 8,    h: 54  },
  // Santa Marta
  { id: 'saint_mta',    label: 'Santa Marta',            x: 67,   y: 24,   w: 9,    h: 50  },
  // San Benito Abad
  { id: 'saint_sb',     label: 'San Benito Abad',        x: 77,   y: 34,   w: 8,    h: 40  },
  // San Francisco de Asís: far-right mid-height
  { id: 'saint_sf',     label: 'San Francisco de Asís',  x: 86,   y: 42,   w: 8,    h: 35  },

  // ── BOTTOM-RIGHT: HOLY WATER + GUITAR ──
  // Holy water font: small wall niche right side
  { id: 'holywater',    label: 'Agua Bendita',           x: 79,   y: 51,   w: 8,    h: 24  },
  // Guitar: leaning against far-right wall (lower portion only)
  { id: 'guitar',       label: 'Guitarra',               x: 88,   y: 57,   w: 12,   h: 40  },

  // ── BOTTOM-RIGHT: CANDLES ──
  // Candles + nativity scene: right side altar area
  { id: 'candles',      label: 'Candelabro',             x: 55,   y: 68,   w: 15,   h: 25  },
  // ── BOTTOM CENTER ──
  // Open book on lectern: foreground center-bottom
  { id: 'book_lectern', label: 'Volver al Leccionario',  x: 38,   y: 76,   w: 24,   h: 22  },
];

// Map hotspot ids to saint data
const SAINT_MAP = {
  saint_vl:  SAINTS_LEFT[0],
  saint_sj:  SAINTS_RIGHT[0],
  saint_sm:  SAINTS_LEFT[1],
  saint_st:  SAINTS_RIGHT[1],
  saint_sa:  SAINTS_LEFT[2],
  saint_mta: SAINTS_LEFT[3],
  saint_sb:  SAINTS_RIGHT[2],
  saint_sf:  SAINTS_RIGHT[3],
  cristo:    CRISTO_REY,
};

export default function ChapelInterior({ onLookDown }) {
  const [debugHotspots, setDebugHotspots] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [activeSaint, setActiveSaint] = useState(null);
  const [showBell, setShowBell] = useState(false);
  const [showGuitar, setShowGuitar] = useState(false);
  const [showBenedict, setShowBenedict] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  const handleOrganBack = () => {
    setActiveView(null);
    if (musicStarted) setShowMiniPlayer(true);
  };

  const handleHotspot = (id) => {
    if (id === 'book_lectern') return onLookDown();
    if (id === 'bell')         return setShowBell(true);
    if (id === 'guitar')       return setShowGuitar(true);
    if (id === 'benedict')     return setShowBenedict(true);
    if (id === 'organ')        return setActiveView('organ');
    if (id === 'library')      return setActiveView('library');
    if (id === 'garden')       return setActiveView('garden');
    if (id === 'candles')      return setActiveView('candles');
    if (id === 'holywater')    return setActiveView('holywater');
    if (id.startsWith('vitraux')) return;
    if (SAINT_MAP[id])         return setActiveSaint(SAINT_MAP[id]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: '#1a1208' }}
    >
      {/* ── CHAPEL IMAGE with hotspots ── */}
      <div
        className="relative w-full"
        style={{ maxWidth: '100vw', aspectRatio: '16/9' }}
      >
        <VisitorCounter />

        {/* Background chapel image */}
        <img
          src={CHAPEL_IMAGE}
          alt="Capilla Ciudad de Dios"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Debug toggle */}
        <button
          onClick={() => setDebugHotspots(v => !v)}
          className="absolute bottom-2 right-2 z-50 text-[10px] px-2 py-1 bg-black/40 text-white rounded opacity-30 hover:opacity-80"
        >
          {debugHotspots ? 'Ocultar zonas' : 'Ver zonas'}
        </button>

        {/* Hotspot overlay layer */}
        {HOTSPOTS.map(spot => (
          <button
            key={spot.id}
            className="absolute cursor-pointer"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: `${spot.w}%`,
              height: `${spot.h}%`,
              background: debugHotspots ? 'rgba(255,100,0,0.25)' : 'transparent',
              border: debugHotspots ? '1px solid rgba(255,100,0,0.6)' : 'none',
              boxSizing: 'border-box',
            }}
            onMouseEnter={() => setHoveredId(spot.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleHotspot(spot.id)}
          >
            {debugHotspots && (
              <span className="absolute top-0 left-0 text-[8px] text-orange-200 bg-black/50 px-0.5 leading-tight pointer-events-none">
                {spot.id}
              </span>
            )}
            {hoveredId === spot.id && !debugHotspots && (
              <span
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-900/90 text-amber-100 text-xs font-body px-2 py-1 rounded whitespace-nowrap shadow pointer-events-none z-10"
              >
                {spot.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Spotify iframe — always mounted once music starts so it keeps playing */}
      {musicStarted && (
        <div className={activeView === 'organ' ? '' : 'hidden'}>
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-amber-50">
            <button
              onClick={handleOrganBack}
              className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors text-amber-900 font-body"
            >
              <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>Volver a la capilla</span>
            </button>
            <div className="w-full max-w-3xl mx-auto px-4">
              <img src={IMAGES.organ} alt="Órgano" className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto mb-6 rounded-xl" />
              <h2 className="font-heading text-2xl md:text-3xl text-amber-900 text-center mb-6">Órgano de la Capilla</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <iframe
                  src="https://open.spotify.com/embed/playlist/2r4eLTMx0dKiuzBD3PF3a3?utm_source=generator"
                  width="100%" height="352" frameBorder="0" allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="rounded-xl"
                />
              </div>
              <p className="text-center mt-3 font-body text-sm text-amber-700">
                Si el reproductor no carga, <a href="https://open.spotify.com/playlist/2r4eLTMx0dKiuzBD3PF3a3" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">abrilo en Spotify</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── OVERLAYS ── */}
      <AnimatePresence>
        {activeView === 'organ' && !musicStarted && <OrganView onBack={handleOrganBack} onMusicStarted={() => { setMusicStarted(true); setActiveView('organ'); }} />}
        {activeView === 'library'  && <LibraryView onBack={() => setActiveView(null)} />}
        {activeView === 'garden'   && <GardenView onBack={() => setActiveView(null)} />}
        {activeView === 'candles'  && <CandleLampadario isOpen onClose={() => setActiveView(null)} />}
        {activeView === 'holywater'&& <HolyWaterView isOpen onClose={() => setActiveView(null)} />}
      </AnimatePresence>

      {/* Saint parchment modal */}
      {activeSaint && (
        <SaintColumn
          saint={activeSaint}
          autoOpen
          onClose={() => setActiveSaint(null)}
        />
      )}

      <ParchmentModal isOpen={showBell} onClose={() => setShowBell(false)} title="Las Campanas de Nagasaki" large>
        <p className="whitespace-pre-line">{BELL_TOWER_TEXT}</p>
      </ParchmentModal>

      <ParchmentModal isOpen={showBenedict} onClose={() => setShowBenedict(false)} title="Escudo de San Benito">
        <div className="text-center space-y-4">
          <img src={IMAGES.benedictRose} alt="Escudo San Benito" className="w-40 h-40 object-contain mx-auto rounded-full shadow-lg" />
          <p className="font-body text-amber-900 leading-relaxed">
            La Medalla de San Benito es uno de los sacramentales más poderosos de la Iglesia Católica.
            Sus letras son iniciales de palabras latinas que invocan protección divina:<br/><br/>
            <strong>C.S.P.B.</strong> — Crux Sancti Patris Benedicti (Cruz del Santo Padre Benito)<br/>
            <strong>C.S.S.M.L.</strong> — Crux Sacra Sit Mihi Lux (La Santa Cruz sea mi luz)<br/>
            <strong>N.D.S.M.D.</strong> — Non Draco Sit Mihi Dux (Que el dragón no sea mi guía)<br/>
            <strong>V.R.S.</strong> — Vade Retro Satana (¡Aléjate, Satanás!)
          </p>
        </div>
      </ParchmentModal>

      <ParchmentModal isOpen={showGuitar} onClose={() => setShowGuitar(false)} title="Guitarra Española">
        <div className="text-center space-y-4">
          <img src={IMAGES.guitar} alt="Guitarra" className="w-32 h-32 object-contain mx-auto" />
          <p className="font-body text-amber-800">Escucha música de guitarra clásica española</p>
          <a href="https://youtube.com/playlist?list=OLAK5uy_k2TKyrSSc_Zu7-V5K3GzAS1sqCZStFjXE&si=hTiF1x5dweRwgNgy"
            target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-700 font-body">
            Escuchar en YouTube
          </a>
        </div>
      </ParchmentModal>

      <MusicMiniPlayer
        isVisible={showMiniPlayer && activeView !== 'organ'}
        isPlaying={true}
        onToggle={() => {}}
        onClose={() => setShowMiniPlayer(false)}
      />
    </motion.div>
  );
}
