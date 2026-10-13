import React from 'react';

export default function CategoriasNav({ categorias, categoriaActiva, onSelectCategoria }) {
  // Aseguramos que "Todas" siempre esté al principio
  const tabs = categorias.includes('Todas') ? categorias : ['Todas', ...categorias];

  return (
    <nav className="sticky top-17 z-30 border-b border-t border-espresso-700 bg-espresso-900/80 backdrop-blur-md">
      <div className="scrollbar-hide overflow-x-auto">
        <div className="mx-auto flex max-w-6xl gap-2 px-4 py-3">
          {tabs.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategoria(cat)}
              className={`flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
                categoriaActiva === cat
                  ? 'bg-gold-500 text-espresso-950 shadow-sm'
                  : 'border border-espresso-500 bg-espresso-700 text-parchment-dim hover:border-espresso-400 hover:text-parchment'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}