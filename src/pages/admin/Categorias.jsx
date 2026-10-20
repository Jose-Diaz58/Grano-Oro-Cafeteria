import { useState, useEffect, useRef } from 'react'
import { GripVertical, Pencil, Trash2, Check, X, Plus } from 'lucide-react'
import Toggle from '../../components/admin/Toggle.jsx'
import EncabezadoPagina from '../../components/admin/EncabezadoPagina.jsx'
import ConfirmarEliminar from '../../components/admin/ConfirmarEliminar.jsx'
import { toast } from 'sonner'
import { pedir, getProducts } from '../../api.js'

export default function Categorias() {
  const [cats, setCats] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [arrastrando, setArrastrando] = useState(null)
  const [nuevo, setNuevo] = useState('')
  const [editId, setEditId] = useState(null)
  const [editVal, setEditVal] = useState('')
  const [porEliminar, setPorEliminar] = useState(null)
  const ordenGuardado = useRef('')

  useEffect(() => {
    let activo = true
    Promise.all([pedir('/categorias/buscar'), getProducts()])
      .then(([dataCats, dataProds]) => {
        if (!activo) return
        const lista = dataCats.map((c) => ({ id: c._id, nombre: c.nombre, visible: c.visible ?? true }))
        setCats(lista)
        ordenGuardado.current = lista.map((c) => c.id).join(',')
        setProductos(dataProds)
      })
      .catch((e) => activo && toast.error(e.message))
      .finally(() => activo && setCargando(false))
    return () => { activo = false }
  }, [])

  const contar = (c) => productos.filter((p) => p.categoria === c.nombre).length
  const existe = (nombre, ignorarId) =>
    cats.some((c) => c.id !== ignorarId && c.nombre.toLowerCase() === nombre.toLowerCase())

  const mover = (destino) => {
    if (arrastrando === null || arrastrando === destino) return
    const copia = [...cats]
    const [item] = copia.splice(arrastrando, 1)
    copia.splice(destino, 0, item)
    setCats(copia)
    setArrastrando(destino)
  }

  // Al soltar, se guarda el nuevo orden (solo si de verdad cambió)
  const guardarOrden = async () => {
    const orden = cats.map((c) => c.id).join(',')
    if (orden === ordenGuardado.current) return
    try {
      await pedir('/categorias/ordenar', { metodo: 'PUT', cuerpo: { ids: cats.map((c) => c.id) } })
      ordenGuardado.current = orden
    } catch (e) {
      toast.error(e.message)
    }
  }

  // Devuelve true si el API aceptó el cambio
  const actualizarEnAPI = async (id, cambios) => {
    const actual = cats.find((c) => c.id === id)
    try {
      await pedir(`/categorias/actualizar/${id}`, { metodo: 'PUT', cuerpo: cambios })
      setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...cambios } : c)))
      if (cambios.nombre && actual) {
        // el API también renombra la categoría en sus productos
        setProductos((prev) => prev.map((p) => (p.categoria === actual.nombre ? { ...p, categoria: cambios.nombre } : p)))
      }
      return true
    } catch (e) {
      toast.error(e.message)
      return false
    }
  }

  const crear = async () => {
    const nombre = nuevo.trim()
    if (!nombre) return
    if (existe(nombre)) {
      toast.error('Ya existe una categoría con ese nombre')
      return
    }
    try {
      const creada = await pedir('/categorias/crear', { metodo: 'POST', cuerpo: { nombre, visible: true } })
      setCats((prev) => [...prev, { id: creada._id, nombre: creada.nombre, visible: creada.visible ?? true }])
      ordenGuardado.current += `,${creada._id}`
      setNuevo('')
      toast.success(`Categoría «${nombre}» creada`)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const empezarEdicion = (c) => {
    setEditId(c.id)
    setEditVal(c.nombre)
  }

  const guardarEdicion = async (c) => {
    const nombre = editVal.trim()
    if (!nombre || nombre === c.nombre) return setEditId(null)
    if (existe(nombre, c.id)) {
      toast.error('Ya existe una categoría con ese nombre')
      return
    }
    if (await actualizarEnAPI(c.id, { nombre })) setEditId(null)
  }

  const eliminar = async () => {
    try {
      await pedir(`/categorias/eliminar/${porEliminar.id}`, { metodo: 'DELETE' })
      setCats((prev) => prev.filter((c) => c.id !== porEliminar.id))
      toast.success('Categoría eliminada')
    } catch (e) {
      toast.error(e.message)
    }
    setPorEliminar(null)
  }

  if (cargando) {
    return <div className="p-6 text-parchment-muted flex items-center justify-center h-[calc(100vh-64px)]">Cargando categorías desde la base de datos...</div>
  }

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-y-auto p-4 styled-scroll sm:p-6 lg:h-[calc(100vh-64px)] lg:p-7">
      <div className="mx-auto max-w-4xl">
        <EncabezadoPagina
          eyebrow="Arquitectura del menú"
          titulo="Gestor de categorías"
          descripcion="Arrastra las secciones para definir el orden en que aparecerán en el menú del cliente."
        />

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-espresso-500 bg-espresso-700 p-4 sm:flex-row">
          <input
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && crear()}
            placeholder="Nombre de la nueva categoría"
            className="h-11 flex-1 rounded-xl border border-espresso-500 bg-espresso-600 px-4 text-sm text-parchment outline-none placeholder:text-parchment-muted focus:border-gold-500 transition-colors"
          />
          <button onClick={crear} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-espresso-950 transition-colors hover:bg-gold-400 active:scale-[0.97]">
            <Plus className="h-4 w-4" strokeWidth={2.5} /> Crear categoría
          </button>
        </div>

        <div className="space-y-3">
          {cats.map((c, i) => {
            const editando = editId === c.id
            return (
              <div
                key={c.id}
                draggable={!editando}
                onDragStart={() => setArrastrando(i)}
                onDragOver={(e) => { e.preventDefault(); mover(i) }}
                onDragEnd={() => { setArrastrando(null); guardarOrden() }}
                className={`flex items-center gap-3 rounded-2xl border bg-espresso-700 p-3 transition-all sm:gap-4 sm:p-4 ${
                  arrastrando === i || editando ? 'border-gold-500 shadow-sm' : 'border-espresso-500 hover:border-gold-500/50'
                }`}
              >
                <div className="cursor-grab text-parchment-muted hover:text-gold-500 active:cursor-grabbing">
                  <GripVertical className="h-5 w-5" />
                </div>
                <span className="hidden h-8 w-8 items-center justify-center rounded-lg bg-espresso-600 text-xs font-semibold text-parchment-muted sm:flex">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  {editando ? (
                    <input
                      autoFocus
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') guardarEdicion(c)
                        if (e.key === 'Escape') setEditId(null)
                      }}
                      className="mb-1 h-10 w-full rounded-xl border border-gold-500 bg-espresso-600 px-3 text-sm font-medium text-parchment outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  ) : (
                    <p className={`truncate text-sm sm:text-base font-medium ${c.visible ? 'text-parchment' : 'text-parchment-muted'}`}>{c.nombre}</p>
                  )}
                  <p className="text-xs text-parchment-muted">{contar(c)} productos</p>
                </div>

                {editando ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => guardarEdicion(c)}
                      aria-label="Guardar nombre"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-espresso-950 transition-colors hover:bg-gold-400"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setEditId(null)} 
                      aria-label="Cancelar" 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-700 text-parchment-muted transition-colors hover:border-espresso-400 hover:text-parchment"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => empezarEdicion(c)} 
                      aria-label={`Renombrar ${c.nombre}`} 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-700 text-parchment-muted transition-colors hover:border-gold-500 hover:text-gold-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPorEliminar(c)}
                      aria-label={`Eliminar ${c.nombre}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-700 text-parchment-muted transition-colors hover:border-red-400/50 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex min-w-15 flex-col items-end sm:min-w-20">
                  <Toggle on={c.visible} onChange={(visible) => actualizarEnAPI(c.id, { visible })} label={`Visibilidad de ${c.nombre}`} />
                  <p className={`mt-1 hidden text-[10px] sm:block ${c.visible ? "text-success" : "text-parchment-muted"}`}>
                    {c.visible ? 'Visible' : 'Oculta'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {porEliminar && (
        contar(porEliminar) > 0 ? (
          <ConfirmarEliminar
            soloAviso
            titulo="No se puede eliminar"
            mensaje={`«${porEliminar.nombre}» tiene ${contar(porEliminar)} productos. Cámbialos de categoría o elimínalos primero.`}
            onCancelar={() => setPorEliminar(null)}
          />
        ) : (
          <ConfirmarEliminar
            titulo="Eliminar categoría"
            mensaje={`¿Seguro que quieres eliminar «${porEliminar.nombre}»?`}
            onConfirmar={eliminar}
            onCancelar={() => setPorEliminar(null)}
          />
        )
      )}
    </div>
  )
}