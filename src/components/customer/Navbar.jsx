import React from 'react';
import { Search, ShoppingCart, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar({ cartCount, onOpenCart, busqueda, setBusqueda, onOpenInfo }) {
  return (
    <header className="sticky top-0 z-40 border-b border-espresso-600 bg-espresso-900/90 pt-[max(1rem,env(safe-area-inset-top))] pb-3 px-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Logo, Info y Carrito (Móvil) */}
        <div className="flex w-full items-center justify-between sm:w-auto sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold tracking-wide text-parchment">
              Grano de Oro
            </h1>
            <button 
              onClick={onOpenInfo} 
              aria-label="Información de la tienda"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-espresso-500 bg-espresso-700 text-parchment-muted transition-colors hover:border-espresso-400 hover:text-parchment focus:outline-none"
            >
              <Info className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          {/* Botón Carrito Mobile */}
          <button 
            onClick={onOpenCart} 
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-700 text-parchment-dim transition-colors hover:text-parchment sm:hidden focus:outline-none"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
            {cartCount > 0 && (
              <span key={cartCount} className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-[10px] font-bold text-espresso-950 cart-bump">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Barra de Búsqueda */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-parchment-muted" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar café, platillos..."
            className="w-full rounded-xl border border-espresso-500 bg-espresso-700 py-2.5 pl-9 pr-4 text-sm text-parchment placeholder-parchment-muted transition-colors focus:border-gold-500 focus:outline-none"
          />
        </div>

        {/* Botón Carrito Desktop */}
        <button 
          onClick={onOpenCart} 
          className="hidden h-11 items-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-espresso-950 transition-colors hover:bg-gold-400 sm:flex active:scale-95"
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2} />
          <span>Ver Carrito</span>
          {cartCount > 0 && (
            <span className="rounded-full bg-espresso-950 px-2 py-0.5 text-xs font-black text-gold-500">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}