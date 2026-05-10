import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '@/lib/constants';
import { base44 } from '@/api/base44Client';

// Convert a Date to YYYY-MM-DD string (local time)
const toDateKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Pre-fetch the next N days so navigation feels instant
const PREFETCH_DAYS = 2;

// Cache in memory so navigating back never re-fetches
const memoryCache = {};

// Convert YYYY-MM-DD to D-M-YYYY for dominicos.org URLs
function toDominicosUrl(dateKey) {
  const [y, m, d] = dateKey.split('-');
  return `https://www.dominicos.org/predicacion/evangelio-del-dia/${parseInt(d)}-${parseInt(m)}-${y}`;
}

async function fetchOrCacheReadings(dateKey, formatted) {
  // 1. Memory hit
  if (memoryCache[dateKey]) return memoryCache[dateKey];

  // 2. Database hit
  const existing = await base44.entities.Reading.filter({ date_key: dateKey });
  if (existing && existing.length > 0) {
    const r = existing[0];
    const parsed = {
      liturgical_day: r.liturgical_day,
      first_reading: { reference: r.first_reading_reference, text: r.first_reading_text },
      psalm: { reference: r.psalm_reference, response: r.psalm_response },
      second_reading: { reference: r.second_reading_reference, text: r.second_reading_text },
      gospel: { reference: r.gospel_reference, text: r.gospel_text },
      homily: r.homily,
    };
    memoryCache[dateKey] = parsed;
    return parsed;
  }

  // 3. LLM fetch
  const dominicosBase = toDominicosUrl(dateKey);
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `Extrae las lecturas litúrgicas del día ${formatted} desde estas URLs de dominicos.org:
- Lecturas: ${dominicosBase}/lecturas/
- Comentario bíblico (reflexión): ${dominicosBase}/comentario-biblico/

Extrae y devuelve exactamente:
1. El día litúrgico (ej: "VI Domingo de Pascua")
2. Primera lectura: referencia completa (ej: "Hch 8, 5-8") y texto íntegro
3. Salmo responsorial: referencia y estribillo
4. Segunda lectura si existe: referencia completa y texto íntegro
5. Evangelio: referencia completa y texto íntegro
6. Reflexión/homilía: el comentario bíblico completo de dominicos.org

Devuelve el texto exacto tal como aparece en el sitio, en español.`,
    response_json_schema: {
      type: 'object',
      properties: {
        liturgical_day: { type: 'string' },
        first_reading: {
          type: 'object',
          properties: { reference: { type: 'string' }, text: { type: 'string' } },
        },
        psalm: {
          type: 'object',
          properties: { reference: { type: 'string' }, response: { type: 'string' } },
        },
        second_reading: {
          type: 'object',
          properties: { reference: { type: 'string' }, text: { type: 'string' } },
        },
        gospel: {
          type: 'object',
          properties: { reference: { type: 'string' }, text: { type: 'string' } },
        },
        homily: { type: 'string' },
      },
    },
    add_context_from_internet: true,
    model: 'gemini_3_flash',
    });

  // 4. Persist to database so future loads are instant
  base44.entities.Reading.create({
    date_key: dateKey,
    liturgical_day: result.liturgical_day || '',
    first_reading_reference: result.first_reading?.reference || '',
    first_reading_text: result.first_reading?.text || '',
    psalm_reference: result.psalm?.reference || '',
    psalm_response: result.psalm?.response || '',
    second_reading_reference: result.second_reading?.reference || '',
    second_reading_text: result.second_reading?.text || '',
    gospel_reference: result.gospel?.reference || '',
    gospel_text: result.gospel?.text || '',
    homily: result.homily || '',
  }).catch(() => {}); // fire-and-forget

  memoryCache[dateKey] = result;
  return result;
}

export default function BookLectern({ onLookUp }) {
  const [dayOffset, setDayOffset] = useState(0);
  const [readings, setReadings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageDirection, setPageDirection] = useState(0);

  const getDateForOffset = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  };

  const currentDate = getDateForOffset(dayOffset);
  const dateStr = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const loadReadings = useCallback(async (offset) => {
    const d = getDateForOffset(offset);
    const key = toDateKey(d);
    const formatted = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    // If already in memory, instant render
    if (memoryCache[key]) {
      setReadings(memoryCache[key]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await fetchOrCacheReadings(key, formatted);
    setReadings(result);
    setLoading(false);
  }, []);

  // Prefetch adjacent days silently
  const prefetch = useCallback((offset) => {
    for (let i = 1; i <= PREFETCH_DAYS; i++) {
      const d = getDateForOffset(offset + i);
      const key = toDateKey(d);
      const formatted = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      if (!memoryCache[key]) {
        fetchOrCacheReadings(key, formatted).catch(() => {});
      }

      const dp = getDateForOffset(offset - i);
      const keyP = toDateKey(dp);
      const formattedP = dp.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      if (!memoryCache[keyP]) {
        fetchOrCacheReadings(keyP, formattedP).catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    setReadings(null);
    loadReadings(dayOffset);
  }, [dayOffset]);

  // After first load, kick off prefetch
  useEffect(() => {
    if (!loading && readings) {
      prefetch(dayOffset);
    }
  }, [loading, readings, dayOffset]);

  const goBack = () => {
    setPageDirection(-1);
    setDayOffset(d => d - 1);
  };

  const goForward = () => {
    setPageDirection(1);
    setDayOffset(d => d + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative px-4 py-8"
      style={{
        background: 'linear-gradient(180deg, #F5EFE0 0%, #EDE4D0 50%, #D4C4A0 100%)',
      }}
    >
      {/* Look up button */}
      <motion.button
        onClick={onLookUp}
        whileHover={{ y: -4 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full shadow-lg text-amber-800 font-body hover:bg-white/90 transition-colors z-10"
      >
        <Eye className="w-5 h-5" />
        Levantar la vista
      </motion.button>

      {/* Source link */}
      <a
        href="https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 text-xs text-amber-600 hover:text-amber-800 font-body underline z-10"
      >
        Fuente: Dominicos.org
      </a>

      {/* Lectern image */}
      <img
        src={IMAGES.lectern}
        alt="Leccionario"
        className="w-32 md:w-40 h-auto mb-2 opacity-80"
      />

      {/* Book container */}
      <div className="relative w-full max-w-3xl">
        {/* Navigation arrows */}
        <button
          onClick={goBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 p-3 bg-amber-800/80 text-amber-100 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goForward}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 p-3 bg-amber-800/80 text-amber-100 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Book pages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dayOffset}
            initial={{ rotateY: pageDirection > 0 ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: pageDirection > 0 ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-amber-50/95 rounded-xl shadow-2xl border border-amber-200/60 overflow-hidden"
            style={{
              perspective: '1000px',
              transformOrigin: pageDirection > 0 ? 'left center' : 'right center',
            }}
          >
            {/* Page ornament top */}
            <div className="h-2 bg-gradient-to-r from-amber-300/40 via-amber-500/40 to-amber-300/40" />

            <div className="p-6 md:p-10">
              {/* Date */}
              <div className="text-center mb-6">
                <p className="font-heading text-lg md:text-2xl text-amber-900 capitalize">
                  {dateStr}
                </p>
                {readings?.liturgical_day && (
                  <p className="font-body text-sm text-amber-600 mt-1 italic">
                    {readings.liturgical_day}
                  </p>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-transparent border-t-amber-700 rounded-full animate-spin" />
                  </div>
                  <p className="font-body text-amber-600 text-sm animate-pulse">Preparando las lecturas del día…</p>
                </div>
              ) : readings ? (
                <div className="space-y-6 font-body text-amber-950">
                  {/* First Reading */}
                  <section>
                    <h3 className="font-heading text-base text-amber-800 mb-1">Primera Lectura</h3>
                    <p className="text-xs text-amber-600 mb-2 italic">{readings.first_reading?.reference}</p>
                    <p className="text-sm leading-relaxed">{readings.first_reading?.text}</p>
                  </section>

                  {/* Psalm */}
                  <section className="bg-amber-100/50 rounded-lg p-4">
                    <h3 className="font-heading text-base text-amber-800 mb-1">Salmo Responsorial</h3>
                    <p className="text-xs text-amber-600 mb-1 italic">{readings.psalm?.reference}</p>
                    <p className="text-sm font-semibold text-amber-900">{readings.psalm?.response}</p>
                  </section>

                  {/* Second Reading */}
                  {readings.second_reading?.text && (
                    <section>
                      <h3 className="font-heading text-base text-amber-800 mb-1">Segunda Lectura</h3>
                      <p className="text-xs text-amber-600 mb-2 italic">{readings.second_reading?.reference}</p>
                      <p className="text-sm leading-relaxed">{readings.second_reading?.text}</p>
                    </section>
                  )}

                  {/* Gospel */}
                  <section className="border-l-4 border-amber-500 pl-4">
                    <h3 className="font-heading text-base text-amber-800 mb-1">Evangelio</h3>
                    <p className="text-xs text-amber-600 mb-2 italic">{readings.gospel?.reference}</p>
                    <p className="text-sm leading-relaxed">{readings.gospel?.text}</p>
                  </section>

                  {/* Homily */}
                  {readings.homily && (
                    <section className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                      <h3 className="font-heading text-base text-amber-800 mb-3">Comentario Bíblico · Dominicos.org</h3>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{readings.homily}</p>
                    </section>
                  )}
                </div>
              ) : null}
            </div>

            {/* Page ornament bottom */}
            <div className="h-2 bg-gradient-to-r from-amber-300/40 via-amber-500/40 to-amber-300/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page number */}
      <p className="font-body text-xs text-amber-500 mt-4">
        Desliza o usa las flechas para cambiar de día
      </p>
    </motion.div>
  );
}
