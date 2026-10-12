import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function ProductDetailModal({ producto, onCerrar, onAgregar }) {
  return (
    <Dialog.Root open={!!producto} onOpenChange={(open) => !open && onCerrar()}>
      <AnimatePresence>
        {producto && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            
            <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center">
              <Dialog.Content asChild aria-describedby="product-desc">
                <motion.div
                  initial={{ y: '100%', opacity: 0.8 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0.04, bottom: 0.55 }}
                  onDragEnd={(_, info) => info.offset.y > 100 && onCerrar()}
                  className="pointer-events-auto relative flex w-full max-h-[92vh] flex-col overflow-hidden rounded-t-2xl border border-b-0 border-espresso-500 bg-espresso-700 sm:mx-4 sm:max-w-lg sm:rounded-2xl sm:border-b"
                >
                  {/* Drag Handle (Solo visible en móvil) */}
                  <div className="flex h-7 w-full shrink-0 items-center justify-center sm:hidden" aria-hidden="true">
                    <div className="h-1 w-10 rounded-full bg-espresso-400" />
                  </div>

                  <div className="relative h-56 w-full shrink-0 bg-espresso-600">
                    <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <button 
                      onClick={onCerrar}
                      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
                      <Dialog.Title className="font-display text-2xl font-bold text-white drop-shadow-md">
                        {producto.nombre}
                      </Dialog.Title>
                      <p className="text-lg font-bold text-gold-400 drop-shadow-md">${producto.precio}</p>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                    <Dialog.Description id="product-desc" className="text-sm leading-relaxed text-parchment-muted">
                      {producto.descripcion}
                    </Dialog.Description>
                  </div>

                  {/* Sticky Footer */}
                  <div className="shrink-0 border-t border-espresso-600 bg-espresso-700 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { onAgregar(producto); onCerrar(); }}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-gold-500 font-semibold text-espresso-950 transition-colors hover:bg-gold-400 focus:outline-none"
                    >
                      Añadir al carrito
                    </motion.button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}