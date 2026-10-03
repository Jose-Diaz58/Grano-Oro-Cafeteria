import React from 'react';

export default function ProductCard({ producto, onAgregar, onVerDetalle }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between p-4 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="h-40 w-full object-cover rounded-xl mb-3"
        />
        <h3 className="font-bold text-stone-900 text-sm mb-1">{producto.nombre}</h3>
        <p className="text-stone-500 text-xs mb-3 line-clamp-2">{producto.descripcion}</p>
        <p className="text-stone-900 font-extrabold text-base mb-3">${producto.precio}</p>
      </div>

      {/* Botones estilo de tu diseño */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => onAgregar(producto)}
          className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors"
        >
          + Añadir
        </button>

        <button
          onClick={() => onVerDetalle(producto)}
          className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-serif font-bold text-xs flex items-center justify-center transition-colors border border-stone-200"
          title="Ver detalle"
        >
          ℹ️
        </button>
      </div>
    </div>
  );
}