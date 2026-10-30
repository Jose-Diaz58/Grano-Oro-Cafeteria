import { motion } from 'motion/react'
import { Clock3, Settings } from 'lucide-react'
import { CONFIG_INICIAL } from '../config/constants'
import { formatearHoraLocal } from '../utils/tienda'

export default function ClosedNotice({ config, nextOpening = 'Mañana a las 7:00 AM', onAdmin, brandLogoUrl }) {
  const dato = (campo) => config?.[campo] || CONFIG_INICIAL[campo]
  const nombreNegocio = dato('nombre')

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-dvh overflow-hidden bg-espresso-900 px-5 py-6 sm:px-8"
    >
      <div
        className="pointer-events-none absolute -left-28 top-1/4 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-espresso-500/50 blur-3xl"
        aria-hidden="true"
      />

      {onAdmin && (
        <button
          onClick={onAdmin}
          className="absolute right-5 top-[max(1.5rem,env(safe-area-inset-top))] z-10 flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-espresso-500 bg-espresso-700/90 px-3.5 text-xs font-semibold text-parchment-dim shadow-sm backdrop-blur transition-colors hover:border-gold-500 hover:text-parchment sm:right-8"
        >
          <Settings className="h-4 w-4" strokeWidth={1.8} />
          Administración
        </button>
      )}

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center pb-[max(1rem,env(safe-area-inset-bottom))] pt-20 text-center">
        {brandLogoUrl && (
          <motion.img
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            src={brandLogoUrl}
            alt={nombreNegocio}
            className="mb-7 h-28 w-auto mix-blend-multiply sm:h-36"
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="w-full rounded-4xl border border-espresso-500 bg-espresso-700/90 p-6 shadow-xl shadow-espresso-500/20 backdrop-blur sm:p-10"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-500">
            <Clock3 className="h-7 w-7" strokeWidth={1.6} />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold-500">
            Fuera de horario
          </p>

          <h1 className="font-display text-4xl font-semibold leading-tight text-parchment sm:text-5xl">
            La tienda está cerrada
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-parchment-muted sm:text-base">
            Estamos descansando para volver a servirte café recién hecho. En este momento no es posible realizar pedidos.
          </p>

          <div className="mx-auto mt-7 grid max-w-md gap-3 rounded-2xl bg-espresso-900 p-4 text-left sm:grid-cols-2 sm:p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-parchment-muted">
                Próxima apertura
              </p>
              <p className="mt-1 text-sm font-semibold capitalize text-parchment">
                {nextOpening}
              </p>
            </div>
            <div className="border-t border-espresso-600 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-parchment-muted">
                Horario habitual
              </p>
              <p className="mt-1 text-sm font-semibold text-parchment">
                {dato('dias')}
              </p>
              <p className="mt-0.5 text-xs text-parchment-muted">
                {formatearHoraLocal(dato('apertura'))} - {formatearHoraLocal(dato('cierre'))}
              </p>
            </div>
          </div>
        </motion.div>

        <p className="mt-5 text-xs text-parchment-muted">
          {dato('sucursal')} • {dato('ubicacion')}
        </p>
      </div>
    </motion.main>
  )
}