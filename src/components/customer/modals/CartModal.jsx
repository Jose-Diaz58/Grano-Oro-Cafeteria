import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Minus, Plus, ShoppingCart, ShoppingBag } from 'lucide-react';

export default function CartModal({ 
  mostrar, onCerrar, carrito, totalPrecio, onEnviarPedido, 
  onIncrementar, onDecrementar, onEliminar 
}) {
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

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
            
            <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center">
              <Dialog.Content asChild>
                <motion.div
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                  className="pointer-events-auto relative flex h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl border border-b-0 border-espresso-500 bg-espresso-900 sm:h-[85vh] sm:max-w-lg sm:rounded-2xl sm:border-b"
                >
                  {/* Header del Carrito */}
                  <header className="flex shrink-0 items-center justify-between border-b border-espresso-600 bg-espresso-900/90 px-4 py-4 backdrop-blur-xl">
                    <div>
                      <Dialog.Title className="font-display text-xl font-semibold text-parchment">Tu Carrito</Dialog.Title>
                      <p className="text-sm text-parchment-muted">{totalItems} artículo{totalItems !== 1 && 's'}</p>
                    </div>
                    <button 
                      onClick={onCerrar}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso-700 text-parchment-muted transition-colors hover:text-parchment focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </header>

                  {/* Lista de Productos */}
                  <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-5">
                    {carrito.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center opacity-80">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-espresso-500 bg-espresso-700">
                          <ShoppingCart className="h-8 w-8 text-parchment-muted" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-parchment">Tu carrito está vacío</h3>
                        <p className="mt-2 text-sm text-parchment-muted">Agrega un delicioso café o platillo para comenzar.</p>
                        <button onClick={onCerrar} className="mt-6 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-espresso-950 transition-colors hover:bg-gold-400">
                          Explorar Menú
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 pb-8">
                        {carrito.map((item) => {
                          const id = item._id || item.id;
                          return (
                            <div key={id} className="relative overflow-hidden rounded-2xl bg-red-600">
                              <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center text-white" aria-hidden="true">
                                <Trash2 className="h-6 w-6" />
                              </div>
                              <motion.div 
                                drag="x" 
                                dragConstraints={{ left: -96, right: 0 }} 
                                dragElastic={0.1}
                                onDragEnd={(_, info) => {
                                  if (info.offset.x < -70 || info.velocity.x < -500) {
                                    onEliminar(id);
                                  }
                                }}
                                className="relative flex items-center gap-3 rounded-2xl border border-espresso-500 bg-espresso-700 p-4"
                              >
                                <img src={item.imagen} alt={item.nombre} className="h-14 w-14 shrink-0 rounded-xl bg-espresso-600 object-cover" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex justify-between gap-2">
                                    <p className="truncate text-sm font-medium leading-snug text-parchment">{item.nombre}</p>
                                    <button onClick={() => onEliminar(id)} className="shrink-0 p-1 text-parchment-muted transition-colors hover:text-red-400 sm:hidden">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <p className="mt-0.5 text-sm font-semibold text-gold-500">${item.precio * item.cantidad}</p>
                                </div>

                                <div className="flex shrink-0 items-center rounded-xl border border-espresso-500 bg-espresso-600">
                                  <button onClick={() => onDecrementar(id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-dim transition-colors hover:bg-espresso-500 hover:text-parchment focus:outline-none">
                                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                                  </button>
                                  <span className="w-8 select-none text-center text-sm font-semibold text-parchment">{item.cantidad}</span>
                                  <button onClick={() => onIncrementar(id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-dim transition-colors hover:bg-espresso-500 hover:text-parchment focus:outline-none">
                                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer / Checkout */}
                  {carrito.length > 0 && (
                    <div className="shrink-0 border-t border-espresso-600 bg-espresso-900/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
                      <div className="mx-auto flex max-w-lg items-center gap-4">
                        <div>
                          <p className="text-xs text-parchment-muted">Total a pagar</p>
                          <p className="text-xl font-bold leading-tight text-gold-500">${totalPrecio}</p>
                        </div>
                        <button 
                          onClick={() => {
                            // Envia el pedido vacío asumiendo "Para Llevar" por defecto como MVP. 
                            // Más adelante se conectará el selector de servicio completo.
                            onEnviarPedido({ nombreCliente: 'Cliente', ubicacion: '', notas: '' });
                          }} 
                          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-gold-500 text-base font-semibold text-espresso-950 transition-transform active:scale-[0.98] hover:bg-gold-400 focus:outline-none"
                        >
                          <ShoppingBag className="h-5 w-5" />
                          Confirmar Pedido
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}