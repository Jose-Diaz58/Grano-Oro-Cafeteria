import { motion, AnimatePresence } from 'motion/react'
import { SPLASH_MENU_MS } from '../../../config/constants'
import logo from '../../../assets/Logo-sin-fondo.webp'

export default function SplashScreen({ mostrar }) {
  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-espresso-900"
        >
          <div className="flex flex-col items-center justify-center">
            {/* El logo tenue queda de fondo y el logo completo se revela de abajo hacia arriba encima */}
            <div className="relative h-32 w-auto mb-6">
              <img src={logo} alt="Cargando base" className="h-full w-auto object-contain opacity-20 drop-shadow-xl" />
              <motion.img
                src={logo}
                alt="Cargando lleno"
                className="absolute bottom-0 left-0 h-full w-full object-contain drop-shadow-xl"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: SPLASH_MENU_MS / 1000, ease: 'easeInOut' }}
              />
            </div>

            <h1 className="font-display text-2xl font-bold text-parchment tracking-widest uppercase mb-8">Grano de Oro</h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}