import { useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Store, Clock3, SlidersHorizontal, Save, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { getConfig, updateConfig } from '../../../config/api'
import { CONFIG_INICIAL } from '../../../config/constants'
import { estimarPreparacion } from '../../../utils/tienda'
import Toggle from '../../../components/ui/Toggle'
import { SkeletonCard, SkeletonRow } from '../../../components/ui/Skeletons'
import AdminPageHeader from '../components/AdminPageHeader'
import { useCargaInicial } from '../hooks/useCargaInicial'

const campoClase = 'mt-1.5 h-11 w-full rounded-xl border border-espresso-500 bg-espresso-600 px-4 text-sm text-parchment outline-none transition-colors placeholder:text-parchment-muted focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50'
const tarjetaClase = 'rounded-2xl border border-espresso-500 bg-espresso-700 p-5 sm:p-6 transition-shadow hover:shadow-sm'

function Titulo({ icono: Icono, titulo, sub }) {
  return (
    <div className="mb-5 flex items-start gap-3 sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso-600 text-gold-500 shadow-sm border border-espresso-500/50">
        <Icono className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-parchment leading-tight">{titulo}</h3>
        <p className="mt-0.5 text-xs text-parchment-muted">{sub}</p>
      </div>
    </div>
  )
}

export default function Configuracion() {
  const { actualizarConfig } = useOutletContext()

  const [d, setD] = useState(CONFIG_INICIAL)
  const [guardando, setGuardando] = useState(false)
  const [cambiandoPausa, setCambiandoPausa] = useState(false)
  // Última configuración confirmada en el servidor: "Guardar cambios" y la pausa se guardan por separado
  const servidor = useRef(CONFIG_INICIAL)

  const cargando = useCargaInicial(
    getConfig,
    (data) => {
      setD((prev) => ({ ...prev, ...data }))
      servidor.current = { ...CONFIG_INICIAL, ...data }
    },
    (err) => {
      console.error('Error al cargar la configuración:', err)
      toast.error('No se pudo cargar la configuración actual')
    },
  )

  const set = (k, v) => setD((prev) => ({ ...prev, [k]: v }))

  const [minimo, maximo] = estimarPreparacion(d.minutosPrep || 15)
  const telOk = (d.whatsapp || '').length === 10

  const aplicarPausa = async (pausado) => {
    setCambiandoPausa(true)
    try {
      const guardada = await updateConfig({ ...servidor.current, pausado })
      servidor.current = { ...servidor.current, ...guardada, pausado }
      set('pausado', pausado)
      actualizarConfig({ pausado })
      toast.success(pausado ? 'Recepción de pedidos pausada' : 'Recepción de pedidos reanudada')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo cambiar el estado de la recepción de pedidos')
    } finally {
      setCambiandoPausa(false)
    }
  }

  const alternarPausa = async (pausado) => {
    if (cambiandoPausa) return
    if (pausado) {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        iconColor: '#dc2626',
        title: '¿Pausar la recepción de pedidos?',
        text: 'Los clientes verán la tienda como cerrada y no podrán enviar pedidos hasta que la reanudes.',
        background: '#fffdf8',
        color: '#21140d',
        showCancelButton: true,
        confirmButtonText: 'Sí, pausar',
        confirmButtonColor: '#dc2626',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#796653',
        reverseButtons: true,
      })
      if (!isConfirmed) return
    }
    aplicarPausa(pausado)
  }

  const guardar = async () => {
    try {
      setGuardando(true)
      const cambios = { ...d, pausado: servidor.current.pausado }
      const guardada = await updateConfig(cambios)
      servidor.current = { ...cambios, ...guardada }
      actualizarConfig(servidor.current)
      toast.success('Configuración guardada exitosamente')
    } catch (err) {
      console.error(err)
      toast.error('Ocurrió un error al guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-y-auto">
      <div className="mx-auto max-w-6xl p-4 pb-32 sm:p-6 sm:pb-32 lg:p-7 lg:pb-32">
        <AdminPageHeader
          eyebrow="Ajustes generales"
          title="Configuración de la empresa"
          description="Administra la información pública, el horario y la capacidad operativa desde un solo lugar."
        />

        {cargando ? (
          <div className="grid items-start gap-5 lg:gap-6 xl:grid-cols-[1fr_380px]">
            <div className="space-y-5 lg:space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonRow />
            </div>
            <div className="space-y-5 lg:space-y-6">
              <SkeletonCard />
              <SkeletonRow />
            </div>
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:gap-6 xl:grid-cols-[1fr_380px]">
            <div className="space-y-5 lg:space-y-6">
              
              <section className={tarjetaClase}>
                <Titulo icono={Store} titulo="Información pública" sub="Visible en el menú y los comprobantes." />
                <div className="grid gap-5 md:grid-cols-2">
                  {[
                    ['nombre', 'Nombre del negocio'],
                    ['sucursal', 'Sucursal'],
                    ['ubicacion', 'Institución / Ubicación'],
                    ['eslogan', 'Eslogan']
                  ].map(([k, label]) => (
                    <label key={k} className="text-xs font-medium text-parchment-dim">
                      {label}
                      <input value={d[k] || ''} onChange={(e) => set(k, e.target.value)} className={campoClase} />
                    </label>
                  ))}
                </div>
              </section>

              <section className={tarjetaClase}>
                <Titulo icono={Clock3} titulo="Contacto y horarios" sub="Canal de recepción y ventana de servicio." />
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-xs font-medium text-parchment-dim">
                    WhatsApp para pedidos
                    <div className="relative mt-1.5">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-parchment-muted">+52</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={d.whatsapp || ''}
                        onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={`h-11 w-full rounded-xl border bg-espresso-600 pl-12 pr-4 text-sm text-parchment outline-none transition-colors focus:ring-1 ${telOk ? 'border-espresso-500 focus:border-gold-500 focus:ring-gold-500/50' : 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'}`}
                      />
                    </div>
                    <span className={`mt-1.5 block text-[10px] font-medium uppercase tracking-wider ${telOk ? 'text-success' : 'text-red-400'}`}>
                      {telOk ? 'Número válido' : 'Ingresa 10 dígitos'}
                    </span>
                  </label>

                  <label className="text-xs font-medium text-parchment-dim">
                    Días de atención
                    <select value={d.dias || 'Lunes a Viernes'} onChange={(e) => set('dias', e.target.value)} className={`${campoClase} appearance-none`}>
                      <option>Lunes a Viernes</option>
                      <option>Lunes a Sábado</option>
                      <option>Todos los días</option>
                    </select>
                  </label>

                  <label className="text-xs font-medium text-parchment-dim">
                    Hora de apertura
                    <input type="time" value={d.apertura || '07:00'} onChange={(e) => set('apertura', e.target.value)} className={campoClase} />
                  </label>

                  <label className="text-xs font-medium text-parchment-dim">
                    Hora de cierre
                    <input type="time" value={d.cierre || '17:00'} onChange={(e) => set('cierre', e.target.value)} className={campoClase} />
                  </label>
                </div>
              </section>

              <section className={`${tarjetaClase} flex items-center justify-between gap-6`}>
                <div className="flex items-start gap-4">
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-950/30 text-emerald-500 sm:flex">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-parchment">Aviso de empaque ecológico</h3>
                    <p className="mt-1 text-xs text-parchment-muted">Mostrar “Empaque ecológico incluido en todos los pedidos”</p>
                  </div>
                </div>
                <Toggle on={Boolean(d.ecologico)} onChange={(v) => set('ecologico', v)} label="Aviso de empaque ecológico" />
              </section>
              
            </div>

            <aside className="space-y-5 lg:space-y-6 xl:sticky xl:top-6">
              
              <section className="rounded-2xl border border-gold-500/30 bg-espresso-700 p-5 shadow-sm sm:p-6">
                <Titulo icono={SlidersHorizontal} titulo="Demanda y tiempos" sub="Ajuste rápido operativo." />
                <label className="text-xs font-medium text-parchment-dim">
                  Preparación promedio por pedido
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={d.minutosPrep || 15}
                      onChange={(e) => set('minutosPrep', Math.min(60, Math.max(5, Number(e.target.value))))}
                      className="h-12 w-full rounded-xl border border-espresso-500 bg-espresso-600 px-4 pr-20 text-lg font-semibold text-parchment outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-parchment-muted">minutos</span>
                  </div>
                </label>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-espresso-800 border border-espresso-600 p-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-parchment-muted">Estimación publicada</p>
                    <p className="mt-0.5 text-xs text-parchment-dim">Lo que verá el cliente</p>
                  </div>
                  <p className="text-xl font-bold text-gold-500">{minimo}–{maximo} min</p>
                </div>
              </section>

              <section className={`rounded-2xl border p-5 sm:p-6 transition-colors ${d.pausado ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-espresso-500 bg-espresso-700'}`}>
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className={`text-sm font-semibold transition-colors ${d.pausado ? 'text-red-400' : 'text-parchment'}`}>
                      Pausar recepción de pedidos
                    </p>
                    <p className={`mt-1 text-xs transition-colors ${d.pausado ? 'text-red-400/70' : 'text-parchment-muted'}`}>
                      Modo de emergencia.
                    </p>
                  </div>
                  <Toggle on={Boolean(d.pausado)} onChange={alternarPausa} label="Pausar recepción de pedidos" />
                </div>
                {d.pausado && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                    <p className="text-xs font-medium leading-relaxed text-red-300">
                      El cliente verá un aviso de pausa y no se le permitirá enviar comandas nuevas al sistema.
                    </p>
                  </div>
                )}
              </section>
              
            </aside>
          </div>
        )}
      </div>

      {/* Barra de guardar fijada abajo, respetando el menú lateral en pantallas grandes */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-espresso-600 bg-espresso-900/90 p-4 backdrop-blur-xl md:left-60 lg:left-64 xl:left-72">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-2 sm:px-0">
          <button
            onClick={guardar}
            disabled={!telOk || guardando || cargando}
            className="flex h-11 items-center gap-2 rounded-xl bg-gold-500 px-6 text-sm font-bold text-espresso-950 transition-all hover:bg-gold-400 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Save className="h-4 w-4" strokeWidth={2.5} /> 
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}