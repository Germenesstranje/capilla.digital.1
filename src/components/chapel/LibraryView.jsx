import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '@/lib/constants';
import ParchmentModal from './ParchmentModal';

const LIBRARY_ITEMS = [
  {
    id: 'doctrina',
    type: 'video',
    title: 'Doctrina Social de la Iglesia',
    icon: BookOpen,
    color: 'bg-amber-800',
    url: 'https://youtu.be/1TxrEqiAHEk?si=9UXOdBRWxx1tzVcf',
    embedUrl: 'https://www.youtube.com/embed/1TxrEqiAHEk',
  },
  {
    id: 'catecismo',
    type: 'video',
    title: 'Catecismo de la Iglesia Católica',
    icon: BookOpen,
    color: 'bg-red-900',
    url: 'https://www.youtube.com/watch?v=5jPGGcDz4V0&list=PLhv5PuZkD8SENzQ_NV9HvGeHVnPnxhxxR',
    embedUrl: 'https://www.youtube.com/embed/5jPGGcDz4V0?list=PLhv5PuZkD8SENzQ_NV9HvGeHVnPnxhxxR',
  },
  {
    id: 'cuentos',
    type: 'text',
    title: 'Cuentos',
    icon: BookOpen,
    color: 'bg-green-900',
  },
  {
    id: 'vaticannews',
    type: 'newspaper',
    title: 'Vatican News',
    icon: Newspaper,
    color: 'bg-gray-700',
  },
];

export default function LibraryView({ onBack }) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-amber-50 overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-amber-50/95 backdrop-blur-sm border-b border-amber-200 p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors text-amber-900 font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la capilla
        </button>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        <img
          src={IMAGES.library}
          alt="Biblioteca"
          className="w-40 h-40 object-contain mx-auto mb-4 rounded-xl"
        />
        <h2 className="font-heading text-2xl md:text-3xl text-amber-900 text-center mb-8">
          Mini Biblioteca
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {LIBRARY_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem(item)}
                className={`${item.color} text-white rounded-xl p-5 shadow-lg flex flex-col items-center gap-3 transition-shadow hover:shadow-xl`}
              >
                <Icon className="w-8 h-8" />
                <span className="font-heading text-sm text-center leading-tight">{item.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Rosario link */}
        <div className="text-center mb-8">
          <motion.a
            href="https://youtu.be/K3Aqodkpk7A?si=24nwk9RSXMVRCgG7"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-100 border border-amber-300 rounded-full text-amber-900 font-body shadow-md hover:shadow-lg transition-shadow"
          >
            📿 Santo Rosario
          </motion.a>
        </div>
      </div>

      {/* Item detail modals */}
      <AnimatePresence>
        {selectedItem?.type === 'video' && (
          <ParchmentModal
            isOpen={true}
            onClose={() => setSelectedItem(null)}
            title={selectedItem.title}
            large
          >
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
              <iframe
                src={selectedItem.embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <a
              href={selectedItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-amber-700 underline font-body"
            >
              Ver en YouTube
            </a>
          </ParchmentModal>
        )}

        {selectedItem?.id === 'cuentos' && (
          <ParchmentModal
            isOpen={true}
            onClose={() => setSelectedItem(null)}
            title="Cuentos"
            large
          >
            <div className="space-y-6">
              <h3 className="font-heading text-xl text-amber-900">LA AUSENCIA DEL SEÑOR GLASS</h3>
              <p className="text-sm italic text-amber-700 mb-2">G.K. Chesterton - Padre Brown</p>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {`La sala de consulta del doctor Orion Hood, el eminente criminólogo y especialista en ciertos trastornos morales, estaba frente al mar, en Scarborough...

Este cuento narra la historia del Padre Brown que visita al Dr. Hood para resolver el misterio del señor Todhunter, quien se encierra en su habitación con un misterioso "señor Glass". Mientras el científico elabora complejas teorías sobre chantaje y crimen, el Padre Brown descubre que Todhunter es simplemente un mago practicando sus trucos: ventriloquía, escapismo y prestidigitación. El "señor Glass" nunca existió.`}
              </p>

              <hr className="border-amber-300" />

              <h3 className="font-heading text-xl text-amber-900">EL HOMBRE</h3>
              <p className="text-sm italic text-amber-700 mb-2">Ray Bradbury</p>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {`El capitán Hart llega con su cohete a un planeta desconocido, pero nadie muestra interés en su llegada. Su teniente Martín descubre que un hombre extraordinario apareció el día anterior: alguien que cura enfermos, consuela a los pobres y habla con sabiduría infinita.

El capitán, incrédulo, investiga y cree que es obra de Burton, un rival. Pero cuando llegan las naves de Burton y Ashley, descubren que ambos murieron en una tormenta cósmica hace dos días.

Comprendiendo que han llegado un día después de una visitación divina, el capitán parte obsesivamente a buscarlo de planeta en planeta. Martín, en cambio, decide quedarse, comprendiendo que lo que buscaba ya estaba allí.

El alcalde observa que el capitán "seguirá buscando, planeta tras planeta, y siempre llegará tarde... pensando que va a encontrar lo que ha dejado aquí, en este mismo pueblo."`}
              </p>
            </div>
          </ParchmentModal>
        )}

        {selectedItem?.id === 'vaticannews' && (
          <ParchmentModal
            isOpen={true}
            onClose={() => setSelectedItem(null)}
            title="Vatican News"
            large
          >
            <div className="space-y-6">
              <h3 className="font-heading text-lg text-amber-900">
                Masonería: para los católicos sigue siendo incompatible
              </h3>
              <a
                href="https://www.vaticannews.va/es/vaticano/news/2023-11/masoneria-para-los-catolicos-sigue-siendo-incompatible-pertenece.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-amber-700 underline font-body hover:text-amber-900"
              >
                Leer artículo completo →
              </a>

              <hr className="border-amber-300" />

              <h3 className="font-heading text-lg text-amber-900">
                Iglesia y masonería son profundamente incompatibles
              </h3>
              <a
                href="https://www.vaticannews.va/es/vaticano/news/2024-02/iglesia-y-masoneria-son-profundamente-incompatibles.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-amber-700 underline font-body hover:text-amber-900"
              >
                Leer artículo completo →
              </a>
            </div>
          </ParchmentModal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
