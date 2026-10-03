import React, { useState } from 'react';

export default function CartModal({
  mostrar,
  onCerrar,
  carrito,
  totalPrecio,
  onEnviarPedido,
  onIncrementar,
  onDecrementar,
  onEliminar,
}) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [notas, setNotas] = useState('');

  if (!mostrar) return null;

  const handleEnviar = (e) => {
    e.preventDefault();
    onEnviarPedido({ nombreCliente, ubicacion, notas });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-xl overflow-y-auto">
        <div>
          {/* Header Modal */}
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h3 className="text-lg font-bold font-serif text-stone-900">Tu Pedido</h3>
            <button
              onClick={onCerrar}
              className="text-stone-400 hover:text-stone-600 font-bold text-xl p-1"
            >
              ✕
            </button>
          </div>

          {/* Lista de Productos */}
          {carrito.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-2">🛒</span>
              <p className="text-stone-500 text-sm">Tu carrito está vacío.</p>
              <p className="text-stone-400 text-xs mt-1">¡Elige algo rico del menú!</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3 pt-1">
                    <div className="flex-1 pr-2">
                      <h4 className="font-bold text-sm text-stone-800">{item.nombre}</h4>
                      <p className="text-xs text-amber-700 font-bold">${item.precio} c/u</p>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => onDecrementar(item.id)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-800">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => onIncrementar(item.id)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onEliminar(item.id)}
                        className="text-stone-400 hover:text-red-500 text-xs p-1"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulario de Datos para la Entrega */}
              <form onSubmit={handleEnviar} className="mt-6 space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Datos de Entrega / Recolección
                </h4>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Mesa o Salón Tec
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Mesa 4"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Notas adicionales (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Sin cebolla, poco picante..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer / Enviar WhatsApp */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-stone-700">Total:</span>
            <span className="text-xl font-extrabold text-amber-700">${totalPrecio} MXN</span>
          </div>

          <button
            onClick={handleEnviar}
            disabled={carrito.length === 0}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              carrito.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>📱 Enviar Pedido por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}