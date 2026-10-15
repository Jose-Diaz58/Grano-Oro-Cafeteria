import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SplashScreen({ mostrar }) {
  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-espresso-900"
        >
          <div className="flex flex-col items-center justify-center">
            
            {/* Contenedor relativo para el efecto de apilamiento */}
            <div className="relative h-32 w-auto mb-6">
              
              {/* 1. Logo de fondo: Aparece transparente (opacity-20) */}
              <img 
                src="/Logo-sin-fondo.png" 
                alt="Cargando base" 
                className="h-full w-auto object-contain opacity-20 drop-shadow-xl" 
              />
              
              {/* 2. Logo frontal: Se revela de abajo hacia arriba animando su "recorte" */}
              <motion.img 
                src="/Logo-sin-fondo.png" 
                alt="Cargando lleno" 
                className="absolute bottom-0 left-0 h-full w-full object-contain drop-shadow-xl"
                /* Inicia recortado al 100% desde arriba (completamente invisible) */
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                /* Termina con 0% de recorte (completamente visible) */
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                /* Esta duración mantiene la sincronía exacta de tus 1.7 segundos */
                transition={{ duration: 1.7, ease: "easeInOut" }} 
              />
            </div>
            
            <h1 className="font-display text-2xl font-bold text-parchment tracking-widest uppercase mb-8">
              Grano de Oro
            </h1>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}