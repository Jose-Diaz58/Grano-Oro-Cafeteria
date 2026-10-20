import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Trash2, Plus } from 'lucide-react'
import ConfirmarEliminar from '../../components/admin/ConfirmarEliminar.jsx'
import EncabezadoPagina from '../../components/admin/EncabezadoPagina.jsx'
import { pedir, getProducts } from '../../api.js'

const inputClass = 'h-11 w-full rounded-xl border border-espresso-500 bg-espresso-600 px-4 text-sm text-parchment outline-none placeholder:text-parchment-muted focus:border-gold-500 transition-colors'

export default function Extras() {
  const [extras, setExtras] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [selId, setSelId] = useState(null)
  const [porEliminar, setPorEliminar] = useState(null)

  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')

  const formatear = (e) => ({ id: e._id, nombre: e.nombre, precio: e.precio, productos: e.productos ?? [] })

  useEffect(() => {
    let activo = true
    Promise.all([pedir('/extras/buscar'), getProducts()])
      .then(([dataExtras, dataProds]) => {
        if (!activo) return
        const lista = dataExtras.map(formatear)
        setExtras(lista)
        setSelId(lista[0]?.id ?? null)
        setProductos(dataProds)
      })
      .catch((e) => activo && toast.error(e.message))
      .finally(() => activo && setCargando(false))
    return () => { activo = false }
  }, [])

  const actual = extras.find((e) => e.id === selId)

  const crear = async () => {
    if (!nombre.trim() || !(Number(precio) > 0)) {
      toast.error('Escribe un nombre y un precio válido')
      return
    }
    try {
      const creado = formatear(
        await pedir('/extras/crear', { metodo: 'POST', cuerpo: { nombre: nombre.trim(), precio: Number(precio), productos: [] } }),
      )
      setExtras((prev) => [...prev, creado])
      setSelId(creado.id)
      setNombre('')
      setPrecio('')
      toast.success(`Extra "${creado.nombre}" creado`)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const eliminar = async () => {
    try {
      await pedir(`/extras/eliminar/${porEliminar.id}`, { metodo: 'DELETE' })
      const restantes = extras.filter((e) => e.id !== porEliminar.id)
      setExtras(restantes)
      setSelId(restantes[0]?.id ?? null)
      toast.success('Extra eliminado')
    } catch (e) {
      toast.error(e.message)
    }
    setPorEliminar(null)
  }

  const alternar = async (productoId) => {
    if (!actual) return
    const yaIncluido = actual.productos.includes(productoId)
    const nuevos = yaIncluido ? actual.productos.filter((id) => id !== productoId) : [...actual.productos, productoId]

    const antes = extras
    setExtras(extras.map((e) => (e.id !== actual.id ? e : { ...e, productos: nuevos })))
    try {
      await pedir(`/extras/actualizar/${actual.id}`, { metodo: 'PUT', cuerpo: { productos: nuevos } })
    } catch (e) {
      setExtras(antes)
      toast.error(e.message)
    }
  }

  if (cargando) {
    return <div className="flex h-[calc(100vh-64px)] items-center justify-center p-7 text-parchment-muted">Cargando extras desde la base de datos...</div>
  }

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-y-auto p-4 styled-scroll sm:p-6 lg:h-[calc(100vh-64px)] lg:p-7">
      <div className="mx-auto max-w-6xl">
        <EncabezadoPagina
          eyebrow="Personalización del menú"
          titulo="Modificadores globales"
          descripcion="Crea extras una sola vez y asígnalos a varios productos sin repetir trabajo."
        />

        <div className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
          
          {/* Columna Izquierda: Creación y Lista */}
          <div>
            <div className="mb-5 rounded-2xl border border-espresso-500 bg-espresso-700 p-4 sm:p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-parchment-muted">Nuevo modificador</p>
              <div className="flex flex-col gap-3">
                <input 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Ej. Leche de coco" 
                  className={inputClass} 
                />
                <div className="flex gap-3">
                  <input 
                    type="number" 
                    value={precio} 
                    onChange={(e) => setPrecio(e.target.value)} 
                    placeholder="$0.00" 
                    className={inputClass} 
                  />
                  <button 
                    onClick={crear} 
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 text-sm font-semibold text-espresso-950 transition-colors hover:bg-gold-400 active:scale-[0.97]"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Crear
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {extras.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelId(e.id)}
                  className={`w-full flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                    selId === e.id 
                      ? 'border-gold-500/80 bg-espresso-600 shadow-sm' 
                      : 'border-espresso-500 bg-espresso-700 hover:border-gold-500/40 hover:bg-espresso-700/80'
                  }`}
                >
                  <div className="flex w-full items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${selId === e.id ? 'text-parchment' : 'text-parchment-dim'}`}>{e.nombre}</span>
                    <span className="text-sm font-bold text-gold-500">
                      {e.precio > 0 ? `+$${e.precio}` : 'Gratis'}
                    </span>
                  </div>
                  <p className="text-[11px] text-parchment-muted">{e.productos.length} productos asignados</p>
                </button>
              ))}
              {extras.length === 0 && (
                <div className="rounded-2xl border border-dashed border-espresso-500 p-8 text-center text-sm text-parchment-muted">
                  No hay modificadores creados
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Asignación */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-espresso-500 bg-espresso-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso-600 bg-espresso-700/50 px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-parchment">Asignación en bloque</h3>
                <p className="mt-0.5 text-xs text-parchment-muted">
                  Selecciona los productos compatibles con <span className="font-medium text-parchment">{actual?.nombre?.toLowerCase() || 'el extra'}</span>.
                </p>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="rounded-lg border border-espresso-500 bg-espresso-600 px-3 py-1.5 text-xs font-medium text-parchment-dim shadow-sm">
                  {actual?.productos?.length ?? 0} seleccionados
                </span>
                {actual && (
                  <button
                    onClick={() => setPorEliminar(actual)}
                    aria-label={`Eliminar ${actual.nombre}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-600 text-parchment-muted transition-colors hover:border-red-400/50 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* CUADRÍCULA RESPONSIVA */}
            <div className="max-h-150 overflow-y-auto styled-scroll p-4 sm:p-5">
              {!actual ? (
                <div className="flex h-32 items-center justify-center text-sm text-parchment-muted">
                  Selecciona un modificador para asignar productos
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productos.map((p) => {
                    const isChecked = actual?.productos?.includes(p._id) ?? false;
                    return (
                      <label 
                        key={p._id} 
                        className={`flex cursor-pointer items-center gap-3.5 rounded-xl border p-3.5 transition-colors ${
                          isChecked 
                            ? 'border-gold-500/40 bg-espresso-600/80 shadow-sm' 
                            : 'border-espresso-500/50 bg-espresso-700 hover:border-espresso-400 hover:bg-espresso-600/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => alternar(p._id)}
                          className="h-4.5 w-4.5 rounded border-espresso-500 bg-espresso-800 accent-gold-500 focus:ring-gold-500 focus:ring-offset-espresso-800"
                        />
                        <div className="flex flex-col min-w-0">
                          <p className={`truncate text-sm font-medium ${isChecked ? 'text-parchment' : 'text-parchment-dim'}`}>
                            {p.nombre}
                          </p>
                          <p className="truncate text-[11px] text-parchment-muted">
                            {p.categoria}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {porEliminar && (
        <ConfirmarEliminar
          titulo="Eliminar extra"
          mensaje={`¿Seguro que quieres eliminar "${porEliminar.nombre}"? Se quitará de todos sus productos.`}
          onConfirmar={eliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}
    </div>
  )
}