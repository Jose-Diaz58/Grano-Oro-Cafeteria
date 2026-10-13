import React, { useState } from 'react';

export default function Checkout({ carrito = [], total = 0, onVolver }) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [tipoServicio, setTipoServicio] = useState('comer_aqui'); // 'comer_aqui' | 'para_llevar'
  const [numeroMesa, setNumeroMesa] = useState('');
  const [pagoCon, setPagoCon] = useState('');

  const handleConfirmarPedido = (e) => {
    e.preventDefault();

    if (!nombreCliente.trim()) {
      alert("Por favor ingresa tu nombre.");
      return;
    }

    if (tipoServicio === 'comer_aqui' && !numeroMesa.trim()) {
      alert("Por favor indica tu número de mesa.");
      return;
    }

    // Generamos número de folio único para el pedido (ej. GOC-43418)
    const folio = 'GOC-' + Math.floor(10000 + Math.random() * 90000);

    // Formatear la lista de productos
    const listaProductosTexto = carrito
      .map((item) => `- ${item.cantidad} x ${item.nombre} ($${(item.precio * item.cantidad).toFixed(2)})`)
      .join('\n');

    // Determinar la opción de servicio
    const servicioTexto = tipoServicio === 'comer_aqui' 
      ? `Comer aquí - Mesa ${numeroMesa}` 
      : `Pasaré a recoger / Para llevar`;

    // Texto para método de pago (opcional si el cliente especifica con cuánto paga)
    const pagoTexto = pagoCon ? `\n\nPagaré con: $${pagoCon} en Efectivo` : '';

    // Construcción del mensaje con el formato solicitado
    const mensajeWhatsApp = 
`{Grano de Oro Café}${nombreCliente}

Número de pedido: ${folio}

${listaProductosTexto}

SubTotal: $${total.toFixed(2)}
Total: $${total.toFixed(2)}${pagoTexto}

${servicioTexto}

${nombreCliente}, tu pedido se está preparando con amor. ☕✨

Muchas Gracias !`;

    // Número telefónico de la sucursal
    const telefonoWhatsApp = "529341023997";
    
    // Crear la URL codificada de WhatsApp
    const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md my-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Confirmar Pedido</h2>

      <form onSubmit={handleConfirmarPedido} className="space-y-5">
        {/* Nombre del Cliente */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre del cliente *
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Alexander Maldonado Arias"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-800 outline-none"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </div>

        {/* Tipo de Servicio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ¿Cómo deseas recibir tu pedido?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`p-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${
                tipoServicio === 'comer_aqui'
                  ? 'bg-amber-800 text-white border-amber-800 shadow'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setTipoServicio('comer_aqui')}
            >
              🍽️ Comer aquí
            </button>
            <button
              type="button"
              className={`p-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${
                tipoServicio === 'para_llevar'
                  ? 'bg-amber-800 text-white border-amber-800 shadow'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setTipoServicio('para_llevar')}
            >
              🛍️ Para llevar
            </button>
          </div>
        </div>

        {/* Número de mesa (Condicional) */}
        {tipoServicio === 'comer_aqui' && (
          <div className="animate-fade-in">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Número de mesa *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. 4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-800 outline-none"
              value={numeroMesa}
              onChange={(e) => setNumeroMesa(e.target.value)}
            />
          </div>
        )}

        {/* Pago con efectivo (Opcional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ¿Con cuánto vas a pagar? (Opcional)
          </label>
          <input
            type="number"
            placeholder="Ej. 200"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-800 outline-none"
            value={pagoCon}
            onChange={(e) => setPagoCon(e.target.value)}
          />
        </div>

        {/* Resumen de Total */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
          <span className="font-semibold text-amber-900">Total a Pagar:</span>
          <span className="text-2xl font-bold text-amber-900">${total.toFixed(2)} MXN</span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-2">
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="w-1/3 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
            >
              Volver
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            💬 Enviar Pedido a WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}