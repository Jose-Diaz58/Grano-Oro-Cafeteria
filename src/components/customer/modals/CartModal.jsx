import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { INFO_TIENDA } from '../../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Minus, Plus, ShoppingCart, ShoppingBag, ArrowLeft, Utensils, Loader2 } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { createOrder } from '../../../api.js';

export default function CartModal({ mostrar, onCerrar, info = INFO_TIENDA }) {
  const { carrito, incrementarCantidad, decrementarCantidad, eliminarDelCarrito, limpiarCarrito } = useCartStore();
  
  const [paso, setPaso] = useState('carrito');
  const [nombreCliente, setNombreCliente] = useState('');
  const [tipoServicio, setTipoServicio] = useState('comer_aqui');
  const [numeroMesa, setNumeroMesa] = useState('');
  const [pagoCon, setPagoCon] = useState('');
  const [notasAdicionales, setNotasAdicionales] = useState('');
  const [procesando, setProcesando] = useState(false);

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  // Leemos el estado evaluado por el componente Menu.jsx
  const estadoTienda = info.estadoTienda || { abierto: true };
  const tiendaBloqueada = !estadoTienda.abierto;

  const handleConfirmarPedido = async (e) => {
    e.preventDefault();
    
    // El doble check de seguridad final
    if (tiendaBloqueada) {
       alert(`Lo sentimos, no podemos procesar el pedido. ${estadoTienda.motivo}`);
       return;
    }

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

    try {
      setProcesando(true);
      
      const orderData = {
        cliente: nombreCliente.trim(),
        tipoServicio: tipoServicio === 'comer_aqui' ? 'Comer Aquí' : 'Para Llevar',
        mesa: numeroMesa || 'N/A', 
        notas: notasAdicionales.trim(),
        estado: 'Nuevo',
        productos: carrito.map(item => ({
          productoId: item._id || item.id,
          nombre: item.nombre,
          variante: item.variante || '', 
          extras: (item.extras || []).map((x) => ({ nombre: x.nombre, precio: x.precio })),
          cantidad: item.cantidad,
          precio: item.precio
        })),
        total: totalPrecio
      };

      const pedidoGuardado = await createOrder(orderData);
      const folioReal = pedidoGuardado.folio || pedidoGuardado._id?.substring(pedidoGuardado._id.length - 6).toUpperCase() || 'GOC-EN-SITIO';

      const listaProductosTexto = carrito
        .map((item) => {
          const base = item.variante ? `${item.nombre} (${item.variante})` : item.nombre;
          const nombreVar = item.extras?.length ? `${base} + ${item.extras.map((x) => x.nombre).join(', ')}` : base;
          return `    ${item.cantidad}x ${nombreVar} - $${(item.precio * item.cantidad).toFixed(2)} MXN`;
        })
        .join('\n');

      const servicioTexto = tipoServicio === 'comer_aqui' 
        ? `Comer aquí - Mesa ${numeroMesa}` 
        : `Para llevar / Pasaré a recoger`;

      const notaTexto = notasAdicionales.trim() ? notasAdicionales.trim() : (info.empaqueEcologico ? 'Empaque ecológico incluido' : 'Sin notas');

      const mensajeWhatsApp = `*NUEVO PEDIDO - ${info.nombre.toUpperCase()}*
*Sucursal:* ${info.sucursal}
*Cliente:* ${nombreCliente.trim()}
*Folio:* ${folioReal}
-----------------------------------
*DETALLE DEL PEDIDO:*
${listaProductosTexto}
-----------------------------------
*TOTAL:* $${totalPrecio.toFixed(2)} MXN
*Pagará con:* $${montoPago.toFixed(2)} MXN en Efectivo
*Servicio:* ${servicioTexto}
*Nota adicional:* ${notaTexto}`;

      const telefonoWhatsApp = `52${info.whatsapp}`;
      const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;
      
      limpiarCarrito();
      handleCerrarModal();
      window.open(url, '_blank');

    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu pedido en el servidor. Por favor intenta de nuevo.");
    } finally {
      setProcesando(false);
    }
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

                  <div className="scrollbar-hide flex-1 overflow-y-auto px-4 py-5">
                    
                    {/* Banners de Advertencia en el Modal */}
                    {tiendaBloqueada && (
                      <div className="mb-4 rounded-xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-center">
                        <p className="text-sm font-bold text-red-400">Tienda Cerrada</p>
                        <p className="text-xs text-red-300/80 mt-0.5">{estadoTienda.motivo}</p>
                      </div>
                    )}

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
                            const id = item.cartItemId;
                            return (
                              <div key={id} className="relative overflow-hidden rounded-2xl bg-espresso-700 border border-espresso-500 p-4 flex items-center gap-3">
                                <img src={item.imagen} alt={item.nombre} className="h-14 w-14 shrink-0 rounded-xl bg-espresso-600 object-cover" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium leading-snug text-parchment">
                                    {item.nombre} {item.variante && <span className="text-gold-400">({item.variante})</span>}
                                  </p>
                                  {item.extras?.length > 0 && (
                                    <p className="truncate text-xs text-parchment-muted">+ {item.extras.map((x) => x.nombre).join(', ')}</p>
                                  )}
                                  <p className="mt-0.5 text-sm font-semibold text-gold-500">${item.precio * item.cantidad}</p>
                                </div>
                                <div className="flex shrink-0 items-center rounded-xl border border-espresso-500 bg-espresso-600">
                                  <button onClick={() => decrementarCantidad(id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-dim hover:bg-espresso-500">
                                    <Minus className="h-4 w-4" strokeWidth={2.5} />
                                  </button>
                                  <span className="w-8 select-none text-center text-sm font-semibold text-parchment">{item.cantidad}</span>
                                  <button onClick={() => incrementarCantidad(id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-dim hover:bg-espresso-500">
                                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                                  </button>
                                </div>
                                <button onClick={() => eliminarDelCarrito(id)} className="text-red-400 hover:text-red-300 ml-2">
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )
                    ) : (
                      <form id="checkout-form" onSubmit={handleConfirmarPedido} className="space-y-4 text-parchment pb-8">
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

                        {tipoServicio === 'comer_aqui' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <label className="block text-sm font-semibold mb-1 text-gold-400">Número de mesa *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ej. 4"
                              className="w-full p-3 bg-espresso-800 border border-espresso-600 rounded-xl text-parchment focus:ring-2 focus:ring-gold-500 outline-none"
                              value={numeroMesa}
                              onChange={(e) => setNumeroMesa(e.target.value)}
                            />
                          </motion.div>
                        )}

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

                        <div className="p-4 bg-espresso-800 rounded-xl border border-espresso-600 flex justify-between items-center mt-2">
                          <span className="font-semibold text-parchment-muted">Total a Pagar:</span>
                          <span className="text-2xl font-bold text-gold-500">${totalPrecio.toFixed(2)} MXN</span>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="shrink-0 border-t border-espresso-600 bg-espresso-900/90 p-4">
                    {paso === 'carrito' ? (
                      carrito.length > 0 && (
                        <div className="mx-auto flex max-w-lg items-center gap-4">
                          <div>
                            <p className="text-xs text-parchment-muted">Total a pagar</p>
                            <p className="text-xl font-bold leading-tight text-gold-500">${totalPrecio}</p>
                          </div>
                          <button 
                            onClick={() => setPaso('checkout')}
                            disabled={tiendaBloqueada}
                            className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-all ${
                               tiendaBloqueada 
                                ? 'bg-espresso-800 text-espresso-400 cursor-not-allowed' 
                                : 'bg-[#8B5A2B] hover:bg-[#734922] text-white'
                            }`}
                          >
                            <ShoppingBag className="h-5 w-5" />
                            Proceder al Pedido
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        form="checkout-form"
                        type="submit"
                        disabled={procesando || tiendaBloqueada}
                        className={`w-full h-14 flex items-center justify-center gap-2 font-bold rounded-xl shadow-lg transition-all ${
                          procesando || tiendaBloqueada
                            ? 'bg-espresso-800 text-espresso-400 cursor-not-allowed' 
                            : 'bg-[#8B5A2B] hover:bg-[#734922] text-white'
                        }`}
                      >
                        {procesando ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Procesando Orden...
                          </>
                        ) : (
                          "Confirmar Pedido"
                        )}
                      </button>
                    )}
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