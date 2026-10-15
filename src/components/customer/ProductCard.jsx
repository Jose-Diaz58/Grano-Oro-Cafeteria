import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Plus, Check, Coffee } from 'lucide-react';

export default function ProductCard({ producto, onAgregar, onVerDetalle }) {
  const [justAdded, setJustAdded] = useState(false);
  
  // Estados independientes para la carga de la imagen de este producto
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (producto.disponible === false) return;
    
    // NUEVO: Si el producto tiene variantes, abrimos el modal de detalle para que elija
    if (producto.variantes && producto.variantes.length > 0) {
      onVerDetalle(producto);
    } else {
      // Si no tiene variantes (ej. un café normal), lo agrega directamente
      onAgregar(producto);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const disponible = producto.disponible !== false;

  return (
    <motion.article
      layout
      whileHover={disponible ? { y: -3 } : undefined}
      whileTap={disponible ? { scale: 0.985 } : undefined}
      onClick={() => disponible && onVerDetalle(producto)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-espresso-700 transition-all duration-300 ${
        disponible 
          ? 'cursor-pointer border-espresso-500 hover:border-espresso-400 hover:shadow-sm' 
          : 'opacity-60 border-espresso-500'
      }`}
    >
      {/* Contenedor de Imagen */}
      <div className="relative h-44 overflow-hidden bg-espresso-600">
        {/* Skeleton animado visible MIENTRAS la foto descarga */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 skeleton z-10" />
        )}

        {/* Si la URL falla o no carga la imagen, mostramos un diseño elegante en lugar del icono roto */}
        {imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-espresso-800 text-parchment-muted">
            <Coffee className="h-8 w-8 opacity-40" />
            <span className="text-[11px] font-medium tracking-wide">Error al Cargar</span>
          </div>
        ) : (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } ${
              disponible ? 'group-hover:scale-[1.04]' : 'grayscale'
            }`}
          />
        )}

        {!disponible && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full border border-espresso-500 bg-espresso-950/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-parchment-muted">
              Agotado
            </span>
          </div>
        )}
        
        {/* Overlay de éxito temporal al añadir */}
        {justAdded && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-gold-500/20"
          >
            <motion.div 
              initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}
              className="rounded-full bg-gold-500 p-2.5 shadow-lg"
            >
              <Check className="h-5 w-5 text-espresso-950" strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Información del Producto */}
      <div className="flex flex-col p-4">
        <h3 className="mb-0.5 font-display text-[15px] font-medium leading-snug text-parchment">{producto.nombre}</h3>
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-parchment-muted">{producto.descripcion}</p>
        <p className="mb-3 text-base font-semibold text-parchment">${producto.precio}</p>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            disabled={!disponible}
            aria-label={`Añadir ${producto.nombre}`}
            className={`flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
              disponible
                ? 'bg-gold-500 text-espresso-950 hover:bg-gold-400'
                : 'cursor-not-allowed bg-espresso-600 text-parchment-muted'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Añadido
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Añadir
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={(e) => { e.stopPropagation(); onVerDetalle(producto); }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-600 text-parchment-muted transition-colors hover:border-espresso-400 hover:text-parchment focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            aria-label="Ver detalles"
          >
            <Info className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}