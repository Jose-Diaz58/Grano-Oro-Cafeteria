import React from 'react';

export default function ProductDetailModal({ producto, onCerrar, onAgregar }) {
  if (!producto) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
        <div className="relative">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={onCerrar}
            className="absolute top-3 right-3 bg-stone-900/70 hover:bg-stone-900 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold font-serif text-stone-900">
              {producto.nombre}
            </h3>
            <span className="text-amber-700 font-extrabold text-base">
              ${producto.precio}
            </span>
          </div>

          <p className="text-stone-600 text-xs leading-relaxed">
            {producto.descripcion}
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                onAgregar(producto);
                onCerrar();
              }}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>+ Agregar al carrito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}