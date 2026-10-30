import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'motion/react'

const VARIANTES = {
  centro: {
    contenedor: 'items-center justify-center p-4',
    animacion: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { type: 'spring', stiffness: 400, damping: 30 },
    },
  },
  hoja: {
    contenedor: 'items-end justify-center sm:items-center',
    animacion: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      transition: { type: 'spring', stiffness: 360, damping: 34 },
    },
  },
}

// Modal accesible (Radix) con overlay y animación de entrada/salida.
// "centro": tarjeta centrada. "hoja": hoja inferior en móvil y centrada en pantallas grandes.
// Los extras (drag, initial, exit...) se pasan como props y reemplazan la animación de la variante.
export default function Modal({ abierto, onCerrar, variante = 'centro', describedBy, className, children, ...animacion }) {
  const { contenedor, animacion: porDefecto } = VARIANTES[variante]

  return (
    <Dialog.Root open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <AnimatePresence>
        {abierto && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <div className={`pointer-events-none fixed inset-0 z-50 flex ${contenedor}`}>
              <Dialog.Content asChild aria-describedby={describedBy}>
                <motion.div {...porDefecto} {...animacion} className={`pointer-events-auto relative ${className}`}>
                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
