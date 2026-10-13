import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, Leaf, Phone } from 'lucide-react';

export default function InfoModal({ mostrar, onCerrar, info }) {
  return (
    <Dialog.Root open={mostrar} onOpenChange={(open) => !open && onCerrar()}>
      <AnimatePresence>
        {mostrar && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Content asChild aria-describedby="info-desc">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-espresso-500 bg-espresso-700 shadow-2xl"
                >
                  {/* Cabecera */}
                  <div className="border-b border-espresso-600 bg-espresso-800/50 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <Dialog.Title className="font-display text-xl font-bold text-parchment">
                          {info.nombre}
                        </Dialog.Title>
                        <p className="mt-1 text-xs font-medium uppercase tracking-widest text-gold-500">
                          {info.sucursal}
                        </p>
                      </div>
                      <button
                        onClick={onCerrar}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-espresso-600 text-parchment-muted transition-colors hover:bg-espresso-500 hover:text-parchment focus:outline-none"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-5 p-6">
                    <Dialog.Description id="info-desc" className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-4 text-center">
                      <p className="font-display text-sm italic text-gold-600">"{info.slogan}"</p>
                    </Dialog.Description>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-sm text-parchment-dim">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-parchment-muted" />
                        <span>{info.institucion}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-parchment-dim">
                        <Phone className="h-4 w-4 shrink-0 text-parchment-muted" />
                        <span>+52 {info.whatsapp}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-parchment-dim">
                        <Clock className="h-4 w-4 shrink-0 text-parchment-muted" />
                        <span>Lun - Vie (7:00 AM - 5:00 PM)</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-parchment-dim">
                        <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>Empaque ecológico incluido en todos los pedidos.</span>
                      </div>
                    </div>

                    <button
                      onClick={onCerrar}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-gold-500 font-semibold text-espresso-950 transition-colors hover:bg-gold-400 focus:outline-none"
                    >
                      Entendido
                    </button>
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