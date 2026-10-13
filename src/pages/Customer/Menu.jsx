import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function OptionSelectorModal({ producto, onCerrar, onAgregarVariantes }) {
  // Mapa de cantidades por opción, ej: { 'Salsa Roja': 2, 'Salsa Verde': 1 }
  const [cantidades, setCantidades] = useState({});

  // Detectamos la lista de opciones
  const opciones = React.useMemo(() => {
    if (!producto) return [];
    if (Array.isArray(producto.opciones) && producto.opciones.length > 0) {
      return producto.opciones;
    }
    if (producto.nombre.toLowerCase().includes('chilaquiles')) {
      return ['Salsa Roja', 'Salsa Verde'];
    }
    if (producto.nombre.toLowerCase().includes('avena')) {
      return ['Plátano', 'Fresa', 'Manzana'];
    }
    return [];
  }, [producto]);

  // Inicializar contadores en 0
  useEffect(() => {
    if (opciones.length > 0) {
      const inicial = {};
      opciones.forEach(op => { inicial[op] = 0; });
      // Ponemos 1 por defecto en la primera opción para agilizar la compra
      inicial[opciones[0]] = 1;
      setCantidades(inicial);
    }
  }, [producto, opciones]);

  const handleIncrementar = (opcion) => {
    setCantidades(prev => ({ ...prev, [opcion]: (prev[opcion] || 0) + 1 }));
  };

  const handleDecrementar = (opcion) => {
    setCantidades(prev => ({
      ...prev,
      [opcion]: Math.max(0, (prev[opcion] || 0) - 1)
    }));
  };

  const totalSeleccionado = Object.values(cantidades).reduce((sum, cant) => sum + cant, 0);
  const totalPrecioCalculado = totalSeleccionado * (producto?.precio || 0);

  const handleConfirmar = () => {
    if (totalSeleccionado === 0) {
      alert("Por favor selecciona al menos 1 opción con el botón +");
      return;
    }

    // Enviamos cada variante con su cantidad seleccionada
    const listaParaAgregar = [];
    Object.entries(cantidades).forEach(([opcion, cantidad]) => {
      if (cantidad > 0) {
        const nombreBase = producto.nombre
          .replace(/\s*Rojos\/Verdes/i, '')
          .replace(/\s*con plátano, o fresa, o manzana/i, '');

        listaParaAgregar.push({
          ...producto,
          _id: `${producto._id || producto.id}-${opcion.replace(/\s+/g, '-').toLowerCase()}`,
          nombre: `${nombreBase} (${opcion})`,
          cantidad: cantidad
        });
      }
    });

    onAgregarVariantes(listaParaAgregar);
    onCerrar();
  };

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
              <Dialog.Content asChild>
                <motion.div
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                  className="pointer-events-auto relative flex w-full max-h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-espresso-500 bg-espresso-900 sm:mx-4 sm:max-w-md sm:rounded-2xl"
                >
                  {/* Header */}
                  <header className="flex items-center justify-between border-b border-espresso-600 p-4">
                    <div>
                      <Dialog.Title className="font-display text-lg font-bold text-parchment">
                        Elige tus opciones
                      </Dialog.Title>
                      <p className="text-xs text-gold-400 font-semibold">{producto.nombre}</p>
                    </div>
                    <button onClick={onCerrar} className="p-2 text-parchment-muted hover:text-parchment">
                      <X className="h-5 w-5" />
                    </button>
                  </header>

                  {/* Lista con Contadores estilo la imagen */}
                  <div className="p-4 overflow-y-auto space-y-3">
                    <p className="text-xs text-parchment-muted font-medium mb-2">
                      Selecciona la cantidad que deseas de cada variedad:
                    </p>

                    {opciones.map((opcion) => {
                      const cant = cantidades[opcion] || 0;
                      return (
                        <div key={opcion} className="flex items-center justify-between p-3 bg-espresso-800 border border-espresso-600 rounded-xl">
                          <div>
                            <span className="font-semibold text-parchment block">{opcion}</span>
                            <span className="text-xs text-gold-500 font-bold">${producto.precio} c/u</span>
                          </div>

                          {/* Control – 0 + */}
                          <div className="flex items-center gap-3 bg-espresso-700 border border-espresso-500 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => handleDecrementar(opcion)}
                              className={`h-8 w-8 flex items-center justify-center rounded-md text-parchment transition-colors ${
                                cant > 0 ? 'bg-espresso-600 hover:bg-espresso-500' : 'opacity-40 cursor-not-allowed'
                              }`}
                              disabled={cant === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="w-6 text-center font-bold text-parchment text-sm">
                              {cant}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleIncrementar(opcion)}
                              className="h-8 w-8 flex items-center justify-center rounded-md bg-[#8B5A2B] text-white hover:bg-[#734922] transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Confirmar */}
                  <div className="p-4 border-t border-espresso-600 bg-espresso-900">
                    <button
                      onClick={handleConfirmar}
                      className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#734922] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Agregar al carrito · ${totalPrecioCalculado.toFixed(2)}
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