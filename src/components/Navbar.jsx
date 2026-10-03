import React from 'react';

export default function Navbar({ cartCount, onOpenCart, busqueda, setBusqueda, onOpenInfo }) {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo, Nombre y Botón Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <h1 className="font-serif text-lg font-bold text-amber-400 tracking-wide">
              Grano de Oro
            </h1>
            
            {/* Botón de Información (I) */}
            <button
              onClick={onOpenInfo}
              className="ml-1 w-6 h-6 rounded-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-400 font-serif font-bold text-xs flex items-center justify-center transition-colors border border-stone-700"
              title="Información"
            >
              i
            </button>
          </div>

          {/* Botón Carrito Mobile */}
          <button
            onClick={onOpenCart}
            className="sm:hidden relative p-2 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar café, chilaquiles..."
            className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 text-xs rounded-xl pl-9 pr-8 py-2 border border-stone-700 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Botón Carrito Desktop */}
        <button
          onClick={onOpenCart}
          className="hidden sm:flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
        >
          <span>🛒 Carrito</span>
          {cartCount > 0 && (
            <span className="bg-stone-950 text-amber-400 text-xs font-black px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}