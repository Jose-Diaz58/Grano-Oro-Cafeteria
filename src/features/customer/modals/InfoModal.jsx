import * as Dialog from '@radix-ui/react-dialog'
import { X, MapPin, Clock, Leaf, Phone, Timer } from 'lucide-react'
import Modal from '../../../components/ui/Modal'
import { estimarPreparacion } from '../../../utils/tienda'

export default function InfoModal({ mostrar, onCerrar, info }) {
  const [prepDesde, prepHasta] = info.minutosPrep ? estimarPreparacion(info.minutosPrep) : []

  return (
    <Modal
      abierto={mostrar}
      onCerrar={onCerrar}
      describedBy="info-desc"
      className="w-full max-w-sm overflow-hidden rounded-2xl border border-espresso-500 bg-espresso-700 shadow-2xl"
    >
      <div className="relative flex flex-col items-center justify-center bg-white p-6 pt-8 border-b border-espresso-500">
        <button
          onClick={onCerrar}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-espresso-800 text-parchment-muted hover:bg-espresso-600 hover:text-parchment transition-colors focus:outline-none z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="h-36 w-full flex items-center justify-center">
          <img src={info.logoUrl} alt={info.nombre} className="h-full w-auto object-contain" />
        </div>

        <Dialog.Title className="mt-3 font-display text-xl font-bold text-espresso-950 text-center">{info.nombre}</Dialog.Title>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 text-center mt-0.5">{info.sucursal}</p>
      </div>

      <div className="space-y-5 p-6">
        <Dialog.Description id="info-desc" className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-4 text-center">
          <p className="font-display text-sm italic text-gold-600">"{info.slogan}"</p>
        </Dialog.Description>

        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm text-parchment-dim">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-parchment-muted" />
            <span>{info.institucion}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-parchment-dim">
            <Phone className="h-4 w-4 shrink-0 text-parchment-muted" />
            <span>+52 {info.whatsapp}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-parchment-dim">
            <Clock className="h-4 w-4 shrink-0 text-parchment-muted" />
            <span>{info.dias ?? 'Lun - Vie'} ({info.horario ?? '7:00 AM - 5:00 PM'})</span>
          </div>
          {prepDesde && (
            <div className="flex items-center gap-3 text-sm text-parchment-dim">
              <Timer className="h-4 w-4 shrink-0 text-parchment-muted" />
              <span>Preparación aprox. {prepDesde}–{prepHasta} min</span>
            </div>
          )}
          {info.empaqueEcologico && (
            <div className="flex items-start gap-3 text-sm text-parchment-dim">
              <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>Empaque ecológico incluido en todos los pedidos.</span>
            </div>
          )}
        </div>

        <button
          onClick={onCerrar}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-gold-500 font-semibold text-espresso-950 transition-colors hover:bg-gold-400 focus:outline-none"
        >
          Entendido
        </button>
      </div>
    </Modal>
  )
}
