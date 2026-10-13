import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Minus, Plus, ShoppingCart, ShoppingBag, ArrowLeft, Utensils } from 'lucide-react';

export default function CartModal({ 
  mostrar, onCerrar, carrito, totalPrecio, 
  onIncrementar, onDecrementar, onEliminar 
}) {
  const [paso, setPaso] = useState('carrito'); // 'carrito' | 'checkout'
  const [nombreCliente, setNombreCliente] = useState('');
  const [tipoServicio, setTipoServicio] = useState('comer_aqui'); // 'comer_aqui' | 'para_llevar'
  const [numeroMesa, setNumeroMesa] = useState('');
  const [pagoCon, setPagoCon] = useState('');
  const [notasAdicionales, setNotasAdicionales] = useState('');

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  const handleEnviarWhatsApp = (e) => {
    e.preventDefault();

    if (!nombreCliente.trim()) {
      alert("Por favor ingresa tu nombre.");
      return;
    }

    if (tipoServicio === 'comer_aqui' && !numeroMesa.trim()) {
      alert("Por favor indica tu número de mesa.");
      return;
    }

    const montoPago = parseFloat(pagoCon);
    if (isNaN(montoPago) || montoPago < totalPrecio) {
      alert(`El monto de pago debe ser mayor o igual al total ($${totalPrecio.toFixed(2)} MXN).`);
      return;
    }

    // Generar Folio aleatorio
    const folio = 'GOC-' + Math.floor(10000 + Math.random() * 90000);

    // Formatear la lista de productos
    const listaProductosTexto = carrito
      .map((item) => `  • ${item.cantidad}x ${item.nombre} - $${(item.precio * item.cantidad).toFixed(2)} MXN`)
      .join('\n');

    // Servicio seleccionado
    const servicioTexto = tipoServicio === 'comer_aqui' 
      ? `Comer aquí - Mesa ${numeroMesa}` 
      : `Para llevar / Pasaré a recoger`;

    // Nota adicional personalizada
    const notaTexto = notasAdicionales.trim() 
      ? notasAdicionales.trim() 
      : 'Empaque ecológico incluido';

    // Mensaje estructurado y limpio
    const mensajeWhatsApp = 
`*NUEVO PEDIDO - GRANO DE ORO CAFÉ*
*Sucursal:* Sucursal Tec
*Cliente:* ${nombreCliente.trim()}
*Folio:* ${folio}
-----------------------------------

*DETALLE DEL PEDIDO:*
${listaProductosTexto}

-----------------------------------
*TOTAL:* $${totalPrecio.toFixed(2)} MXN
*Pagaré con:* $${montoPago.toFixed(2)} MXN en Efectivo
*Servicio:* ${servicioTexto}
*Nota adicional:* ${notaTexto}`;

    const telefonoWhatsApp = "529341023997";
    const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;
    
    window.open(url, '_blank');
  };

  const handleCerrarModal = () => {
    setPaso('carrito');
    onCerrar();
  };

  return (
    <Dialog.Root open={mostrar} onOpenChange={(open) => !open && handleCerrarModal()}>
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
                  {/* Header */}
                  <header className="flex shrink-0 items-center justify-between border-b border-espresso-600 bg-espresso-900/90 px-4 py-4 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      {paso === 'checkout' && (
                        <button onClick={() => setPaso('carrito')} className="text-parchment-muted hover:text-parchment mr-1">
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                      )}
                      <div>
                        <Dialog.Title className="font-display text-xl font-semibold text-parchment">
                          {paso === 'carrito' ? 'Tu Carrito' : 'Finalizar Pedido'}
                        </Dialog.Title>
                        <p className="text-sm text-parchment-muted">
                          {paso === 'carrito' ? `${totalItems} artículo(s)` : 'Completa tus datos'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleCerrarModal}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso-700 text-parchment-muted transition-colors hover:text-parchment focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </header>

                  {/* Cuerpo */}
                  <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-5">
                    {paso === 'carrito' ? (
                      carrito.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center opacity-80">
                          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-espresso-500 bg-espresso-700">
                            <ShoppingCart className="h-8 w-8 text-parchment-muted" />
                          </div>
                          <h3 className="font-display text-xl font-semibold text-parchment">Tu carrito está vacío</h3>
                          <p className="mt-2 text-sm text-parchment-muted">Agrega un delicioso café o platillo para comenzar.</p>
                          <button onClick={handleCerrarModal} className="mt-6 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-espresso-950 transition-colors hover:bg-gold-400">
                            Explorar Menú
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 pb-8">
                          {carrito.map((item) => {
                            const id = item._id || item.id;
                            return (
                              <div key={id} className="relative overflow-hidden rounded-2xl bg-espresso-700 border border-espresso-500 p-4 flex items-center gap-3">
                                <img src={item.imagen} alt={item.nombre} className="h-14 w-14 shrink-0 rounded-xl bg-espresso-600 object-cover" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium leading-snug text-parchment">{item.nombre}</p>
                                  <p className="mt-0.5 text-sm font-semibold text-gold-500">${item.precio * item.cantidad}</p>
                                </div>
                                <div className="flex shrink-0 items-center rounded-xl border border-espresso-500 bg-espresso-600">
                                  <button onClick={() => onDecrementar(id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-dim hover:bg-espresso-500">
                                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                                  </button>
                                  <span className="w-8 select-none text-center text-sm font-semibold text-parchment">{item.cantidad}</span>
                                  <button onClick={() => onIncrementar(id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-dim hover:bg-espresso-500">
                                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                                  </button>
                                </div>
                                <button onClick={() => onEliminar(id)} className="text-red-400 hover:text-red-300 ml-2">
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )
                    ) : (
                      /* Formulario de Finalizar Pedido */
                      <form onSubmit={handleEnviarWhatsApp} className="space-y-4 text-parchment pb-8">
                        {/* Nombre */}
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gold-400">Nombre del cliente *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Alexander Maldonado Arias"
                            className="w-full p-3 bg-espresso-800 border border-espresso-600 rounded-xl text-parchment focus:ring-2 focus:ring-gold-500 outline-none"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                          />
                        </div>

                        {/* Tipo de Servicio */}
                          <div>
                          <label className="block text-sm font-semibold mb-2 text-gold-400">¿Cómo deseas recibir tu pedido?</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              className={`p-3 rounded-xl border font-medium flex items-center justify-center gap-2 transition-all ${
                                tipoServicio === 'comer_aqui'
                                  ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] font-bold shadow-md'
                                  : 'bg-espresso-800 text-parchment border-espresso-600 hover:bg-espresso-700'
                              }`}
                              onClick={() => setTipoServicio('comer_aqui')}
                            >
                              <Utensils className="h-5 w-5 shrink-0" />
                              <span>Comer aquí</span>
                            </button>

                            <button
                              type="button"
                              className={`p-3 rounded-xl border font-medium flex items-center justify-center gap-2 transition-all ${
                                tipoServicio === 'para_llevar'
                                  ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] font-bold shadow-md'
                                  : 'bg-espresso-800 text-parchment border-espresso-600 hover:bg-espresso-700'
                              }`}
                              onClick={() => setTipoServicio('para_llevar')}
                            >
                              <ShoppingBag className="h-5 w-5 shrink-0" />
                              <span>Para llevar</span>
                            </button>
                          </div>
                        </div>

                        {/* Mesa */}
                        {tipoServicio === 'comer_aqui' && (
                          <div>
                            <label className="block text-sm font-semibold mb-1 text-gold-400">Número de mesa *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej. 4"
                              className="w-full p-3 bg-espresso-800 border border-espresso-600 rounded-xl text-parchment focus:ring-2 focus:ring-gold-500 outline-none"
                              value={numeroMesa}
                              onChange={(e) => setNumeroMesa(e.target.value)}
                            />
                          </div>
                        )}

                        {/* Pago Obligatorio y Positivo */}
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gold-400">¿Con cuánto vas a pagar? *</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          required
                          placeholder={`Mínimo $${totalPrecio.toFixed(2)}`}
                          className="w-full p-3 bg-espresso-800 border border-espresso-600 rounded-xl text-parchment focus:ring-2 focus:ring-gold-500 outline-none"
                          value={pagoCon}
                          onChange={(e) => {
                        
                            const val = e.target.value;
                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                              setPagoCon(val);
                            }
                          }}
                        />
                        </div>

                        {/* Nueva Sección: Notas o Indicaciones Especiales */}
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gold-400">Instrucciones o notas adicionales</label>
                          <textarea
                            rows={2}
                            placeholder="Ej. Poco hielo, sin cebolla, salsa aparte..."
                            className="w-full p-3 bg-espresso-800 border border-espresso-600 rounded-xl text-parchment focus:ring-2 focus:ring-gold-500 outline-none resize-none"
                            value={notasAdicionales}
                            onChange={(e) => setNotasAdicionales(e.target.value)}
                          />
                        </div>

                        {/* Total */}
                        <div className="p-4 bg-espresso-800 rounded-xl border border-espresso-600 flex justify-between items-center mt-2">
                          <span className="font-semibold text-parchment-muted">Total a Pagar:</span>
                          <span className="text-2xl font-bold text-gold-500">${totalPrecio.toFixed(2)} MXN</span>
                        </div>

                        {/* Botón Estilo Café/Dorado */}
                        <button
                          type="submit"
                          className="w-full py-4 bg-[#8B5A2B] hover:bg-[#734922] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                        >
                          Confirmar Pedido
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Footer inicial */}
                  {carrito.length > 0 && paso === 'carrito' && (
                    <div className="shrink-0 border-t border-espresso-600 bg-espresso-900/90 p-4">
                      <div className="mx-auto flex max-w-lg items-center gap-4">
                        <div>
                          <p className="text-xs text-parchment-muted">Total a pagar</p>
                          <p className="text-xl font-bold leading-tight text-gold-500">${totalPrecio}</p>
                        </div>
                        <button 
                          onClick={() => setPaso('checkout')} 
                          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#8B5A2B] text-white text-base font-semibold hover:bg-[#734922]"
                        >
                          <ShoppingBag className="h-5 w-5" />
                          Proceder al Pedido 
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