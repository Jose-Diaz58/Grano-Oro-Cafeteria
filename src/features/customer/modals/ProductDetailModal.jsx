import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import Modal from '../../../components/ui/Modal'
import { optimizarImagen } from '../../../utils/imagen'

function DetalleProducto({ producto, onCerrar, onAgregar }) {
  const variantes = producto.variantes ?? []
  const extrasDisponibles = producto.extras ?? []

  const [varianteSeleccionada, setVarianteSeleccionada] = useState(variantes[0] ?? '')
  const [extrasSel, setExtrasSel] = useState([]) // ids de los extras marcados

  const elegidos = extrasDisponibles.filter((e) => extrasSel.includes(e._id))
  const precioFinal = producto.precio + elegidos.reduce((suma, e) => suma + e.precio, 0)

  const alternarExtra = (id) =>
    setExtrasSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleAgregar = () => {
    onAgregar(producto, varianteSeleccionada, elegidos)
    onCerrar()
  }

  return (
    <>
      <div className="flex h-7 w-full shrink-0 items-center justify-center sm:hidden" aria-hidden="true">
        <div className="h-1 w-10 rounded-full bg-espresso-400" />
      </div>

      <div className="relative h-56 w-full shrink-0 bg-espresso-600">
        <img src={optimizarImagen(producto.imagen, 800)} alt={producto.nombre} decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        <button
          onClick={onCerrar}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <Dialog.Title className="font-display text-2xl font-bold text-white drop-shadow-md">{producto.nombre}</Dialog.Title>
          <p className="text-lg font-bold text-gold-400 drop-shadow-md">${precioFinal}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
        <Dialog.Description id="product-desc" className="text-sm leading-relaxed text-parchment-muted">
          {producto.descripcion}
        </Dialog.Description>

        {variantes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gold-400 mb-3">Elige una opción:</h4>
            <div className="flex flex-wrap gap-2">
              {variantes.map((variante) => (
                <button
                  key={variante}
                  onClick={() => setVarianteSeleccionada(variante)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all focus:outline-none ${
                    varianteSeleccionada === variante
                      ? 'bg-gold-500 text-espresso-950 border-gold-500 shadow-md'
                      : 'bg-espresso-800 text-parchment border-espresso-600 hover:border-gold-500/50 hover:bg-espresso-700'
                  }`}
                >
                  {variante}
                </button>
              ))}
            </div>
          </div>
        )}

        {extrasDisponibles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gold-400 mb-3">Agrega extras:</h4>
            <div className="space-y-2">
              {extrasDisponibles.map((extra) => (
                <label
                  key={extra._id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                    extrasSel.includes(extra._id) ? 'border-gold-500 bg-gold-500/10' : 'border-espresso-600 bg-espresso-800 hover:border-gold-500/50'
                  }`}
                >
                  <span className="flex items-center gap-3 text-parchment">
                    <input
                      type="checkbox"
                      checked={extrasSel.includes(extra._id)}
                      onChange={() => alternarExtra(extra._id)}
                      className="h-4 w-4 accent-gold-500"
                    />
                    {extra.nombre}
                  </span>
                  <span className="font-semibold text-gold-400">+${extra.precio}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-espresso-600 bg-espresso-700 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAgregar}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gold-500 font-semibold text-espresso-950 transition-colors hover:bg-gold-400 focus:outline-none shadow-lg"
        >
          Añadir al carrito · ${precioFinal}
        </motion.button>
      </div>
    </>
  )
}

export default function ProductDetailModal({ producto, onCerrar, onAgregar }) {
  return (
    <Modal
      abierto={!!producto}
      onCerrar={onCerrar}
      variante="hoja"
      describedBy="product-desc"
      initial={{ y: '100%', opacity: 0.8 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.04, bottom: 0.55 }}
      onDragEnd={(_, info) => info.offset.y > 100 && onCerrar()}
      className="flex w-full max-h-[92vh] flex-col overflow-hidden rounded-t-2xl border border-b-0 border-espresso-500 bg-espresso-700 sm:mx-4 sm:max-w-lg sm:rounded-2xl sm:border-b"
    >
      {producto && <DetalleProducto key={producto._id} producto={producto} onCerrar={onCerrar} onAgregar={onAgregar} />}
    </Modal>
  )
}