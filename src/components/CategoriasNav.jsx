import React from 'react';

export default function CategoriasNav({ categorias, categoriaActiva, onSelectCategoria }) {
  return (
    <nav className="max-w-6xl mx-auto px-4 my-6 overflow-x-auto">
      <div className="flex gap-2 pb-2">
        {['Todas', ...categorias].map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategoria(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              categoriaActiva === cat
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}