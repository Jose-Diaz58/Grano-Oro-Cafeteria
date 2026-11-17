import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import Modal from '../../../components/ui/Modal'
import EstadoPedido from '../components/EstadoPedido'
import { leerFolio, leerUltimoFolio } from '../../../utils/folio'

// Se monta cada vez que se abre el modal, así recuerda el último folio del día
function Contenido({ onCerrar }) {
  const [recordado] = useState(leerUltimoFolio)
  const [texto, setTexto] = useState(recordado ? String(recordado) : '')
  const [folio, setFolio] = useState(recordado)
  const [errorForm, setErrorForm] = useState('')

  const buscar = (e) => {
    e.preventDefault()
    const n = leerFolio(texto)
    if (!n) {
      setErrorForm('Escribe el número de tu folio, por ejemplo #012')
      return
    }
    setErrorForm('')
    setFolio(n)
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-espresso-600 px-4 py-4">
        <Dialog.Title className="font-display text-xl font-semibold text-parchment">Seguir mi pedido</Dialog.Title>
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-espresso-700 text-parchment-muted hover:text-parchment focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="space-y-5 overflow-y-auto px-4 py-5">
        <form onSubmit={buscar} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Tu folio, ej. #012"
            className="w-full rounded-xl border border-espresso-600 bg-espresso-800 p-3 text-parchment focus:ring-2 focus:ring-gold-500 outline-none"
          />
          <button type="submit" className="rounded-xl bg-[#8B5A2B] px-5 font-semibold text-white hover:bg-[#734922]">
            Buscar
          </button>
        </form>
        {errorForm && <p className="text-sm text-red-400">{errorForm}</p>}

        {folio && <EstadoPedido key={folio} folio={folio} />}
      </div>
    </>
  )
}

export default function SeguimientoModal({ abierto, onCerrar }) {
  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      variante="centro"
      className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-espresso-500 bg-espresso-900"
    >
      <Contenido onCerrar={onCerrar} />
    </Modal>
  )
}