import { useState, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { RefreshCw, ArrowLeft, Package } from 'lucide-react'
import { ESTADOS, BADGE } from '../../data/mockData'
import { toast } from 'sonner'
import { getOrders } from '../../api.js'
import { formatear, claveDia } from '../../hooks/usePedidosEnVivo.js'

const LIMITE_HISTORIAL = 300

// "Ayer" / "viernes, 16 de octubre"
const etiquetaDia = (clave) => {
  const [a, m, d] = clave.split('-').map(Number)
  const fecha = new Date(a, m - 1, d)
  const ayer = new Date()
  ayer.setDate(ayer.getDate() - 1)
  if (clave === claveDia(ayer)) return 'Ayer'
  const txt = fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
  return txt.charAt(0).toUpperCase() + txt.slice(1)
}

function TarjetaPedido({ p, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative min-w-[82vw] snap-center rounded-2xl border px-4 py-4 text-left shadow-sm transition-colors hover:bg-espresso-800 md:w-full md:min-w-0 md:snap-none md:rounded-none md:border-0 md:border-b md:border-espresso-700/60 md:px-4 md:py-3.5 md:shadow-none ${
        activo
          ? "border-gold-500 bg-gold-500/8 md:bg-espresso-800"
          : "border-espresso-500 bg-espresso-700 md:bg-transparent"
      }`}
    >
      {activo && (
        <span className="absolute bottom-3 left-0 top-3 hidden w-0.5 rounded-r bg-gold-500 md:block" />
      )}
      <div className="mb-2 flex items-center justify-between md:mb-1">
        <span className="text-base font-semibold text-parchment md:text-sm">{p.cliente}</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${BADGE[p.estado] || 'bg-espresso-600 text-parchment'}`}>
          {p.estado}
        </span>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs text-parchment-dim">{p.numero || p.id} • {p.hora}</p>
        </div>
        <p className="text-sm font-semibold text-gold-500">${p.total} • {p.pago}</p>
      </div>
    </button>
  )
}

function DetallePedido({ sel, onCambiarEstado, soloLectura, onVolver }) {
  return (
    <div className="max-w-2xl p-4 pb-8 sm:p-6 mx-auto w-full">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-500 md:hidden">
        Detalle de la comanda
      </p>

      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-parchment">{sel.cliente}</h2>
          <p className="mt-1 text-sm text-parchment-muted">
            {soloLectura && `${etiquetaDia(sel.dia)} • `}{sel.numero || sel.id} • {sel.hora} • {sel.pago}
          </p>
        </div>
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${BADGE[sel.estado] || 'bg-espresso-600 text-parchment'}`}>
          {sel.estado}
        </span>
      </div>

      <div className="mb-4 overflow-hidden rounded-2xl border border-espresso-500 bg-espresso-700">
        {sel.items.map((it, i) => (
          <div key={i} className="flex items-center justify-between border-b border-espresso-600 px-4 py-3.5 last:border-0 sm:px-5">
            <span className="text-parchment text-sm">
              {it.nombre || it.producto}
              {it.variante && <span className="text-parchment-muted"> ({it.variante})</span>}
              {it.extras?.length > 0 && <span className="text-gold-500"> + {it.extras.map(x => x.nombre).join(', ')}</span>}
              <span className="text-parchment-muted ml-1">×{it.cant || it.cantidad || 1}</span>
            </span>
            <span className="text-parchment-dim text-sm">${(it.precio || 0) * (it.cant || it.cantidad || 1)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between bg-espresso-600/50 px-4 py-4 sm:px-5">
          <span className="text-parchment font-semibold text-sm">Total</span>
          <span className="text-gold-500 font-bold text-lg">${sel.total}</span>
        </div>
      </div>

      {sel.nota && (
        <div className="bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3 mb-5">
          <p className="text-amber-400/60 text-[11px] uppercase tracking-wider mb-1">Nota especial</p>
          <p className="text-parchment-dim text-sm">{sel.nota}</p>
        </div>
      )}

      {!soloLectura && (
        <div>
          <p className="text-parchment-muted text-[11px] uppercase tracking-wider mb-3">Cambiar estado</p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {ESTADOS.map((e) => (
              <button
                key={e}
                onClick={() => onCambiarEstado(sel.id, e)}
                className={`h-12 rounded-xl px-3 text-sm font-medium transition-all duration-150 sm:h-9 sm:px-4 ${
                  sel.estado === e
                    ? BADGE[e] || 'bg-gold-500 text-espresso-700 font-bold'
                    : 'bg-espresso-700 border border-espresso-500 text-parchment-muted hover:text-parchment hover:border-espresso-400'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Pedidos() {
  const { pedidosVivo } = useOutletContext()
  const { pedidos, cargando, cambiarEstado: guardarEstado } = pedidosVivo

  const [vista, setVista] = useState('hoy')
  const [selId, setSelId] = useState(null)

  const hoy = claveDia(new Date())
  const pedidosHoy = pedidos.filter((p) => p.dia === hoy)
  const activos = pedidosHoy.filter((p) => p.estado !== 'Entregado').length
  const anterioresPendientes = pedidos.filter((p) => p.dia < hoy && p.estado !== 'Entregado').length

  const [historial, setHistorial] = useState([])
  const [cargandoHist, setCargandoHist] = useState(false)
  const [errorHist, setErrorHist] = useState(false)

  const cargarHistorial = useCallback(async () => {
    setCargandoHist(true)
    setErrorHist(false)
    try {
      const data = await getOrders(LIMITE_HISTORIAL)
      setHistorial((Array.isArray(data) ? data : []).map(formatear))
    } catch (err) {
      console.error('Error al cargar el historial:', err)
      setErrorHist(true)
      toast.error('No se pudo cargar el historial')
    } finally {
      setCargandoHist(false)
    }
  }, [])

  const grupos = useMemo(() => {
    const anteriores = historial.filter((p) => p.dia < hoy)
    const porDia = new Map()
    anteriores.forEach((p) => porDia.set(p.dia, [...(porDia.get(p.dia) || []), p]))
    return [...porDia.entries()]
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([dia, lista]) => ({ dia, lista, total: lista.reduce((s, p) => s + (p.total || 0), 0) }))
  }, [historial, hoy])

  const lista = vista === 'hoy' ? pedidosHoy : grupos.flatMap((g) => g.lista)
  const idActual = lista.some((p) => p.id === selId) ? selId : lista[0]?.id
  const sel = lista.find((p) => p.id === idActual)

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await guardarEstado(id, nuevoEstado)
      toast.success(`Pedido actualizado a ${nuevoEstado}`)
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar el estado del pedido')
    }
  }

  if (cargando) {
    return <div className="p-6 text-parchment-muted">Cargando pedidos de la base de datos...</div>
  }

  const pestana = (id, texto, aviso) => (
    <button
      onClick={() => {
        setVista(id)
        if (id === 'historial') cargarHistorial()
      }}
      className={`flex-1 h-9 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
        vista === id ? 'bg-gold-500 text-espresso-950 shadow-sm' : 'text-parchment-muted hover:text-parchment hover:bg-espresso-600'
      }`}
    >
      {texto}
      {aviso > 0 && <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white leading-none">{aviso}</span>}
    </button>
  )

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col overflow-visible bg-espresso-900 md:h-[calc(100vh-64px)] md:flex-row md:overflow-hidden">
      
      {/* Lista de Pedidos (Carrusel Móvil / Barra Lateral Desktop) */}
      <div className="flex w-full shrink-0 flex-col border-b border-espresso-600 md:w-72 md:border-b-0 md:border-r xl:w-80">
        
        <div className="p-2 border-b border-espresso-600 flex gap-1 bg-espresso-700">
          {pestana('hoy', 'Pedidos del día', 0)}
          {pestana('historial', 'Pedidos anteriores', anterioresPendientes)}
        </div>

        {vista === 'hoy' ? (
          <>
            <div className="flex items-center justify-between border-b border-espresso-700 px-4 py-4 md:py-3">
              <div>
                <p className="text-sm font-semibold text-parchment">Hoy</p>
                <p className="mt-0.5 text-[11px] text-parchment-muted md:hidden">Desliza para revisar</p>
              </div>
              <span className="rounded-full border border-espresso-500 bg-espresso-700 px-2.5 py-1 text-xs text-parchment-muted">
                {activos} activos
              </span>
            </div>
            
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto p-3 md:block md:flex-1 md:overflow-y-auto md:p-0 md:styled-scroll">
              {pedidosHoy.length === 0 ? (
                <div className="m-1 flex min-w-[calc(100vw-2rem)] flex-col items-center rounded-2xl border border-dashed border-espresso-500 bg-espresso-700/50 px-4 py-8 text-center md:m-4 md:min-w-0">
                  <Package className="mb-3 h-9 w-9 text-parchment-muted opacity-50" strokeWidth={1.4} />
                  <p className="font-display text-base font-semibold text-parchment">Sin pedidos activos</p>
                </div>
              ) : (
                pedidosHoy.map((p) => (
                  <TarjetaPedido key={p.id} p={p} activo={p.id === idActual} onClick={() => setSelId(p.id)} />
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-espresso-700 px-4 py-4 md:py-3">
              <div>
                <p className="text-sm font-semibold text-parchment">Historial</p>
                <p className="mt-0.5 text-[11px] text-parchment-muted md:hidden">Desliza para revisar</p>
              </div>
              <button
                onClick={cargarHistorial}
                disabled={cargandoHist}
                className="h-8 w-8 rounded-xl bg-espresso-700 border border-espresso-500 flex items-center justify-center text-parchment-muted hover:text-parchment hover:border-espresso-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${cargandoHist ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto p-3 md:block md:flex-1 md:overflow-y-auto md:p-0 md:styled-scroll">
              {cargandoHist && historial.length === 0 ? (
                <p className="p-4 text-xs text-parchment-muted min-w-[80vw] md:min-w-0 text-center">Cargando historial...</p>
              ) : errorHist && historial.length === 0 ? (
                <p className="p-4 text-xs text-red-400 min-w-[80vw] md:min-w-0 text-center">No se pudo cargar.</p>
              ) : grupos.length === 0 ? (
                <div className="m-1 flex min-w-[calc(100vw-2rem)] flex-col items-center rounded-2xl border border-dashed border-espresso-500 bg-espresso-700/50 px-4 py-8 text-center md:m-4 md:min-w-0">
                  <Package className="mb-3 h-9 w-9 text-parchment-muted opacity-50" strokeWidth={1.4} />
                  <p className="font-display text-base font-semibold text-parchment">Sin historial</p>
                </div>
              ) : (
                grupos.map((g) => (
                  <div key={g.dia} className="flex gap-3 md:block shrink-0 items-stretch">
                    <div className="sticky left-0 md:top-0 z-10 px-4 py-3 md:py-2 bg-espresso-600 md:bg-espresso-600/90 md:backdrop-blur-sm md:border-b border-espresso-500 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between shrink-0 min-w-30 md:min-w-0 rounded-2xl md:rounded-none">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-parchment">{etiquetaDia(g.dia)}</span>
                      <span className="text-[11px] text-parchment-muted mt-1 md:mt-0">{g.lista.length} pd • ${g.total}</span>
                    </div>
                    {g.lista.map((p) => (
                      <TarjetaPedido key={p.id} p={p} activo={p.id === idActual} onClick={() => setSelId(p.id)} />
                    ))}
                  </div>
                ))
              )}
              {historial.length >= LIMITE_HISTORIAL && (
                <p className="p-4 text-[11px] text-parchment-muted min-w-[80vw] md:min-w-0 text-center shrink-0">
                  Se muestran los {LIMITE_HISTORIAL} más recientes.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detalle del Pedido */}
      <div className="flex-1 overflow-y-auto styled-scroll bg-espresso-900">
        {!sel ? (
          <div className="h-full flex items-center justify-center text-parchment-muted">
            Selecciona un pedido para ver los detalles
          </div>
        ) : (
          <DetallePedido sel={sel} onCambiarEstado={cambiarEstado} soloLectura={vista === 'historial'} />
        )}
      </div>
    </div>
  )
}