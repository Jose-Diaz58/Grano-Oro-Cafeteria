import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { trackOrder } from '../../../config/api'
import { formatearFolio } from '../../../utils/folio'

const PASOS = [
  { estado: 'Nuevo', titulo: 'Pedido recibido' },
  { estado: 'Preparando', titulo: 'En preparación' },
  { estado: 'Listo', titulo: 'Listo para recoger' },
  { estado: 'Entregado', titulo: 'Entregado' },
]
const INTERVALO_MS = 8000

export default function EstadoPedido({ folio }) {
  const [pedido, setPedido] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    let timer

    const consultar = async () => {
      try {
        const datos = await trackOrder(folio)
        if (!activo) return
        setPedido(datos)
        setError('')
        if (datos.estado !== 'Entregado') timer = setTimeout(consultar, INTERVALO_MS)
      } catch (err) {
        if (!activo) return
        if (err.status === 404) {
          setError(err.message) // el folio no existe: no tiene caso reintentar
          return
        }
        setError(err.status === 429 ? 'Demasiadas consultas, espera un momento.' : err.message)
        timer = setTimeout(consultar, INTERVALO_MS * 2)
      }
    }

    consultar()
    return () => {
      activo = false
      clearTimeout(timer)
    }
  }, [folio])

  if (!pedido) {
    return error ? (
      <p className="rounded-xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-center text-sm text-red-300">{error}</p>
    ) : (
      <div className="flex justify-center py-10 text-parchment-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const indice = Math.max(PASOS.findIndex((p) => p.estado === pedido.estado), 0)

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-parchment-muted">Tu folio</p>
        <p className="font-display text-5xl font-bold text-gold-500">{formatearFolio(pedido.folio)}</p>
      </div>

      <ol className="space-y-3">
        {PASOS.map((paso, i) => {
          const hecho = i < indice
          const actual = i === indice
          const completo = hecho || (actual && paso.estado === 'Entregado')
          return (
            <li key={paso.estado} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  completo
                    ? 'border-gold-500 bg-gold-500 text-espresso-950'
                    : actual
                      ? 'border-gold-500 text-gold-500'
                      : 'border-espresso-500 text-parchment-muted'
                }`}
              >
                {completo ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </span>
              <span className={actual ? 'font-semibold text-parchment' : hecho ? 'text-parchment-dim' : 'text-parchment-muted'}>
                {paso.titulo}
              </span>
            </li>
          )
        })}
      </ol>

      {pedido.productos?.length > 0 && (
        <ul className="rounded-xl border border-espresso-600 bg-espresso-800 px-4 py-3 text-sm text-parchment-dim">
          {pedido.productos.map((p, i) => (
            <li key={i}>
              {p.cantidad}× {p.nombre}
            </li>
          ))}
        </ul>
      )}

      {pedido.estado !== 'Entregado' && (
        <p className="text-center text-[11px] text-parchment-muted">Se actualiza automáticamente</p>
      )}
    </div>
  )
}