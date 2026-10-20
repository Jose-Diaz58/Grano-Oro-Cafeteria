import { useState, useEffect, useRef } from 'react'
import { CATEGORIAS } from '../../data/mockData.js'
import { toast } from 'sonner'
import { Trash2, Pencil, ImageOff, Upload, Link as LinkIcon, X, Plus, Package } from 'lucide-react'
import ConfirmarEliminar from '../../components/admin/ConfirmarEliminar.jsx'
import { getProducts, createProduct, updateProduct, deleteProduct, pedir } from '../../api.js'
import { comprimirImagen, esDataUrl, esUrlHttp, ENTRADA_MAX_MB, SALIDA_MAX_KB } from '../../utils/imagen.js'

const campo = 'w-full bg-espresso-600 border border-espresso-500 rounded-xl px-4 py-2.5 text-sm text-parchment placeholder:text-parchment-muted focus:outline-none focus:border-gold-500 transition-colors'

const formVacio = (categoria = '') => ({
  id: null, nombre: '', precio: '', categoria, porcion: '', descripcion: '', variantes: '', imagen: '',
})

const formDeProducto = (p) => ({
  id: p._id,
  nombre: p.nombre || '',
  precio: String(p.precio ?? ''),
  categoria: p.categoria || '',
  porcion: p.porcion || '',
  descripcion: p.descripcion || '',
  variantes: (p.variantes || []).join(', '),
  imagen: p.imagen || '',
})

function Miniatura({ src, nombre }) {
  const [falla, setFalla] = useState(false)
  if (!src || falla) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso-600 text-parchment-muted">
        <ImageOff className="h-4 w-4" />
      </div>
    )
  }
  return <img src={src} alt={nombre} onError={() => setFalla(true)} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
}

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  const [editId, setEditId] = useState(null)
  const [editVal, setEditVal] = useState('')

  const [form, setForm] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [procesandoImg, setProcesandoImg] = useState(false)
  const [modoImg, setModoImg] = useState('url')

  const [porEliminar, setPorEliminar] = useState(null)
  const inputArchivo = useRef(null)

  const nombresCat = categorias.length > 0 ? categorias : CATEGORIAS

  useEffect(() => {
    let activo = true
    Promise.all([getProducts(), pedir('/categorias/buscar')])
      .then(([dataProds, dataCats]) => {
        if (!activo) return
        setProductos(dataProds)
        setCategorias(dataCats.map((c) => c.nombre))
      })
      .catch((e) => activo && toast.error(e.message))
      .finally(() => activo && setCargando(false))
    return () => { activo = false }
  }, [])

  const actualizarEnAPI = async (id, cambios) => {
    try {
      const { modificar } = await updateProduct(id, cambios)
      setProductos((prev) => prev.map((p) => (p._id === id ? modificar : p)))
      return modificar
    } catch (e) {
      toast.error(e.message)
      return null
    }
  }

  const guardarPrecio = async (p) => {
    const n = parseInt(editVal)
    setEditId(null)
    if (!(n > 0) || n === p.precio) return
    if (await actualizarEnAPI(p._id, { precio: n })) toast.success(`Precio de ${p.nombre} actualizado`)
  }

  const cambiarDisponible = async (p) => {
    const actualizado = await actualizarEnAPI(p._id, { disponible: !p.disponible })
    if (actualizado) toast.success(`${p.nombre}: ${actualizado.disponible ? 'disponible' : 'agotado'}`)
  }

  const abrirCrear = () => {
    setModoImg('url')
    setForm(formVacio(nombresCat[0] ?? ''))
  }

  const abrirEditar = (p) => {
    setModoImg(esDataUrl(p.imagen) ? 'archivo' : 'url')
    setForm(formDeProducto(p))
  }

  const cerrarForm = () => {
    if (guardando) return
    setForm(null)
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const elegirArchivo = async (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return

    setProcesandoImg(true)
    try {
      set('imagen', await comprimirImagen(archivo))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setProcesandoImg(false)
    }
  }

  const guardar = async () => {
    const precio = parseInt(form.precio)
    if (!form.nombre.trim() || !(precio > 0)) {
      toast.error('Escribe un nombre y un precio válido')
      return
    }
    const imagen = form.imagen.trim()
    if (imagen && !esDataUrl(imagen) && !esUrlHttp(imagen)) {
      toast.error('El enlace de la imagen debe empezar con http:// o https://')
      return
    }

    const datos = {
      nombre: form.nombre.trim(),
      precio,
      categoria: form.categoria,
      porcion: form.porcion.trim(),
      descripcion: form.descripcion.trim(),
      variantes: form.variantes.split(',').map((v) => v.trim()).filter(Boolean),
      imagen,
    }

    setGuardando(true)
    try {
      if (form.id) {
        const actualizado = await actualizarEnAPI(form.id, datos)
        if (!actualizado) return
        toast.success(`${actualizado.nombre} actualizado`)
      } else {
        const creado = await createProduct({ ...datos, disponible: true })
        setProductos((prev) => [...prev, creado])
        toast.success('Producto guardado')
      }
      setForm(null)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    try {
      await deleteProduct(porEliminar._id)
      setProductos((prev) => prev.filter((p) => p._id !== porEliminar._id))
      toast.success(`${porEliminar.nombre} eliminado`)
    } catch (e) {
      toast.error(e.message)
    }
    setPorEliminar(null)
  }

  const agotados = productos.filter((p) => !p.disponible).length

  if (cargando) {
    return <div className="p-6 text-parchment-muted flex items-center justify-center h-full">Cargando catálogo desde la base de datos...</div>
  }

  const editando = Boolean(form?.id)

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-auto p-4 styled-scroll sm:p-6 md:h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-500">Arquitectura del menú</p>
            <h2 className="font-display text-2xl font-semibold text-parchment mt-1">Catálogo</h2>
            <p className="text-parchment-muted text-sm mt-1">{productos.length} productos • {agotados} agotados</p>
          </div>
          <button
            onClick={abrirCrear}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-espresso-950 transition-all hover:bg-gold-400 active:scale-[0.97] sm:h-10 sm:w-auto"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Añadir Producto
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-espresso-600 bg-espresso-800">
          <table className="w-full min-w-140 text-left">
            <thead>
              <tr className="border-b border-espresso-600">
                {["Producto", "Categoría", "Precio", "Estado", ""].map((h, i) => (
                  <th key={i} className={`text-parchment-muted text-[11px] uppercase tracking-wider px-5 py-3.5 ${h === "Categoría" ? "hidden lg:table-cell" : ""} ${h === "Estado" ? "text-center" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Package className="mx-auto mb-3 h-10 w-10 text-parchment-muted opacity-50" />
                    <p className="font-display text-lg font-semibold text-parchment">Catálogo vacío</p>
                  </td>
                </tr>
              )}
              {productos.map((p) => {
                const idReal = p._id || p.id
                return (
                  <tr key={idReal} className="border-b border-espresso-600/60 last:border-0 hover:bg-espresso-700/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`${!p.disponible ? "opacity-40 grayscale" : ""}`}>
                          <Miniatura key={p.imagen} src={p.imagen} nombre={p.nombre} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${p.disponible ? 'text-parchment' : 'text-parchment-muted'}`}>{p.nombre}</p>
                          {p.variantes && p.variantes.length > 0 && (
                            <p className="text-parchment-muted text-[11px]">{p.variantes.length} variantes</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs bg-espresso-600 text-parchment-dim border border-espresso-500 px-2.5 py-1 rounded-full">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {editId === idReal ? (
                        <input
                          type="number"
                          autoFocus
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          onBlur={() => guardarPrecio(p)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') guardarPrecio(p)
                            if (e.key === 'Escape') setEditId(null)
                          }}
                          className="w-20 bg-espresso-600 border border-gold-500 rounded-lg px-2.5 py-1 text-sm text-parchment focus:outline-none"
                        />
                      ) : (
                        <button
                          title="Clic para editar precio"
                          onClick={() => { setEditId(idReal); setEditVal(String(p.precio)) }}
                          className="text-sm font-medium text-parchment-dim hover:text-gold-500 transition-colors flex items-center gap-1.5 group"
                        >
                          ${p.precio}
                          <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          role="switch"
                          aria-checked={p.disponible}
                          aria-label={`Disponibilidad de ${p.nombre}`}
                          onClick={() => cambiarDisponible(p)}
                          className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${p.disponible ? 'bg-success/80 border border-success' : 'bg-espresso-700 border border-espresso-500'}`}
                        >
                          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-parchment transition-all ${p.disponible ? 'left-6 shadow-sm' : 'left-1 bg-parchment-muted'}`} />
                        </button>
                        <span className={`text-[10px] font-medium ${p.disponible ? 'text-success' : 'text-parchment-muted'}`}>
                          {p.disponible ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirEditar(p)}
                          aria-label={`Editar ${p.nombre}`}
                          title="Editar producto"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-700 text-parchment-muted hover:border-gold-500 hover:text-gold-500 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPorEliminar(p)}
                          aria-label={`Eliminar ${p.nombre}`}
                          title="Eliminar producto"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-700 text-parchment-muted hover:border-red-400/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {porEliminar && (
        <ConfirmarEliminar
          titulo="Eliminar producto"
          mensaje={`¿Seguro que quieres eliminar "${porEliminar.nombre}"?`}
          onConfirmar={eliminar}
          onCancelar={() => setPorEliminar(null)}
        />
      )}

      {form && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={cerrarForm}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto styled-scroll rounded-t-2xl sm:rounded-2xl border border-espresso-500 bg-espresso-800 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <h3 className="font-display text-xl font-semibold text-parchment mb-5">{editando ? 'Editar producto' : 'Nuevo Producto'}</h3>
            <div className="space-y-4">
              <input
                placeholder="Nombre (ej. Mocha Blanco)"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                className={campo}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Precio MXN (ej. 75)"
                  value={form.precio}
                  onChange={(e) => set('precio', e.target.value)}
                  className={campo}
                />
                <input
                  placeholder="Porción (ej. 12 oz)"
                  value={form.porcion}
                  onChange={(e) => set('porcion', e.target.value)}
                  className={campo}
                />
              </div>
              <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)} className={`${campo} appearance-none`}>
                <option value="" disabled className="text-parchment-muted">Selecciona una categoría</option>
                {form.categoria && !nombresCat.includes(form.categoria) && <option>{form.categoria}</option>}
                {nombresCat.map((n) => <option key={n}>{n}</option>)}
              </select>
              <textarea
                placeholder="Descripción (opcional)"
                rows={2}
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                className={`${campo} resize-none`}
              />
              <input
                placeholder="Variantes separadas por coma (ej. Fresa, Mango)"
                value={form.variantes}
                onChange={(e) => set('variantes', e.target.value)}
                className={campo}
              />

              <div className="rounded-xl border border-espresso-500 bg-espresso-700/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] uppercase tracking-wider text-parchment-muted font-semibold">Imagen</p>
                  <div className="flex gap-1 rounded-lg bg-espresso-900 p-1 border border-espresso-600">
                    <button
                      type="button"
                      onClick={() => setModoImg('url')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${modoImg === 'url' ? 'bg-espresso-700 text-gold-500 shadow-sm' : 'text-parchment-muted hover:text-parchment'}`}
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> Enlace
                    </button>
                    <button
                      type="button"
                      onClick={() => setModoImg('archivo')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${modoImg === 'archivo' ? 'bg-espresso-700 text-gold-500 shadow-sm' : 'text-parchment-muted hover:text-parchment'}`}
                    >
                      <Upload className="h-3.5 w-3.5" /> Archivo
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-espresso-500 bg-espresso-600 text-parchment-muted">
                    {form.imagen ? (
                      <>
                        <img
                          src={form.imagen}
                          alt="Vista previa"
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                          onLoad={(e) => { e.currentTarget.style.display = 'block' }}
                        />
                        <button
                          type="button"
                          onClick={() => set('imagen', '')}
                          aria-label="Quitar imagen"
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <ImageOff className="h-7 w-7 opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {modoImg === 'url' ? (
                      <>
                        <input
                          key="imagen-url"
                          placeholder="https://..."
                          value={esDataUrl(form.imagen) ? '' : form.imagen}
                          onChange={(e) => set('imagen', e.target.value)}
                          className={campo}
                        />
                        <p className="mt-2 text-[11px] text-parchment-muted leading-relaxed">Pega el enlace directo a la imagen (debe terminar en .jpg, .png, etc).</p>
                      </>
                    ) : (
                      <>
                        <input key="imagen-archivo" ref={inputArchivo} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={elegirArchivo} className="hidden" />
                        <button
                          type="button"
                          onClick={() => inputArchivo.current?.click()}
                          disabled={procesandoImg}
                          className="h-11 w-full rounded-xl border border-dashed border-espresso-400 bg-espresso-700/30 text-sm font-medium text-parchment-dim hover:border-gold-500 hover:text-gold-500 transition-colors disabled:opacity-60"
                        >
                          {procesandoImg ? 'Procesando imagen...' : esDataUrl(form.imagen) ? 'Cambiar archivo' : 'Elegir archivo local'}
                        </button>
                        <p className="mt-2 text-[11px] text-parchment-muted leading-relaxed">
                          JPG, PNG, WebP o GIF (máx. {ENTRADA_MAX_MB}MB). Se optimiza automáticamente a {SALIDA_MAX_KB}KB.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={cerrarForm} className="flex-1 h-12 rounded-xl bg-espresso-700 border border-espresso-500 text-sm font-semibold text-parchment-muted hover:text-parchment hover:border-espresso-400 transition-colors">
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando || procesandoImg}
                className="flex-1 h-12 rounded-xl bg-gold-500 text-espresso-950 font-bold text-sm hover:bg-gold-400 transition-colors disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Añadir producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}