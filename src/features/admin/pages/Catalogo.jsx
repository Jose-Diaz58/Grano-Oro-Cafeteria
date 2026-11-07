import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Pencil, ImageOff, Plus, Package } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../../config/api'
import { CATEGORIAS_BASE } from '../../../config/constants'
import { SkeletonRow } from '../../../components/ui/Skeletons'
import { esUrlHttp } from '../../../utils/imagen'
import AdminPageHeader from '../components/AdminPageHeader'
import ConfirmarEliminar from '../components/ConfirmarEliminar'
import ModalProducto from '../components/ModalProducto'
import { useCargaInicial } from '../hooks/useCargaInicial'

const COLUMNAS = ['Producto', 'Categoría', 'Precio', 'Estado', '']

const formVacio = (categoria = '') => ({
  id: null, nombre: '', precio: '', categoria, porcion: '', descripcion: '', variantes: '', imagen: '', imagenFile: null,
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
  imagenFile: null,
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

  const [editId, setEditId] = useState(null)
  const [editVal, setEditVal] = useState('')

  const [form, setForm] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [porEliminar, setPorEliminar] = useState(null)

  const nombresCat = categorias.length > 0 ? categorias : CATEGORIAS_BASE

  const cargando = useCargaInicial(
    () => Promise.all([getProducts(), getCategories()]),
    ([dataProds, dataCats]) => {
      setProductos(dataProds || [])
      setCategorias((dataCats || []).map((c) => c.nombre))
    },
  )

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

  const cerrarForm = () => {
    if (!guardando) setForm(null)
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const guardar = async () => {
    const precio = parseInt(form.precio)
    if (!form.nombre.trim() || !(precio > 0)) {
      toast.error('Escribe un nombre y un precio válido')
      return
    }

    // Armamos un FormData para soportar la subida del archivo físico o texto
    const formData = new FormData()
    formData.append('nombre', form.nombre.trim())
    formData.append('precio', precio)
    formData.append('categoria', form.categoria)
    formData.append('porcion', form.porcion.trim())
    formData.append('descripcion', form.descripcion.trim())
    formData.append('variantes', JSON.stringify(form.variantes.split(',').map((v) => v.trim()).filter(Boolean)))

    // Si hay un archivo local seleccionado, lo adjuntamos
    if (form.imagenFile) {
      formData.append('imagen', form.imagenFile)
    } else if (form.imagen && esUrlHttp(form.imagen)) {
      // Si pegaron una URL directa
      formData.append('imagen', form.imagen)
    }

    setGuardando(true)
    try {
      if (form.id) {
        // Nota: Asegúrate de que tu función updateProduct en config/api.js acepte FormData
        const actualizado = await updateProduct(form.id, formData)
        const prodMod = actualizado.modificar || actualizado
        setProductos((prev) => prev.map((p) => (p._id === form.id ? prodMod : p)))
        toast.success(`${prodMod.nombre} actualizado`)
      } else {
        formData.append('disponible', 'true')
        const creado = await createProduct(formData)
        setProductos((prev) => [...prev, creado])
        toast.success('Producto guardado')
      }
      setForm(null)
    } catch (e) {
      toast.error(e.message || 'Error al guardar el producto')
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

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-auto p-4 sm:p-6 md:h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto">
        <AdminPageHeader
          eyebrow="Arquitectura del menú"
          title="Catálogo"
          description={cargando ? 'Cargando productos...' : `${productos.length} productos • ${agotados} agotados`}
          action={
            <button
              onClick={() => setForm(formVacio(nombresCat[0] ?? ''))}
              disabled={cargando}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 text-sm font-semibold text-espresso-950 transition-all hover:bg-gold-400 active:scale-[0.97] disabled:opacity-50 sm:h-10 sm:w-auto"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Añadir Producto
            </button>
          }
        />

        {cargando ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-espresso-600 bg-espresso-800">
            <table className="w-full min-w-140 text-left">
              <thead>
                <tr className="border-b border-espresso-600">
                  {COLUMNAS.map((titulo, i) => (
                    <th
                      key={i}
                      className={`text-parchment-muted text-[11px] uppercase tracking-wider px-5 py-3.5 ${titulo === 'Categoría' ? 'hidden lg:table-cell' : ''} ${titulo === 'Estado' ? 'text-center' : ''}`}
                    >
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNAS.length} className="px-6 py-16 text-center">
                      <Package className="mx-auto mb-3 h-10 w-10 text-parchment-muted opacity-50" />
                      <p className="font-display text-lg font-semibold text-parchment">Catálogo vacío</p>
                    </td>
                  </tr>
                )}
                {productos.map((p) => (
                  <tr key={p._id} className="border-b border-espresso-600/60 last:border-0 hover:bg-espresso-700/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={p.disponible ? '' : 'opacity-40 grayscale'}>
                          <Miniatura key={p.imagen} src={p.imagen} nombre={p.nombre} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${p.disponible ? 'text-parchment' : 'text-parchment-muted'}`}>{p.nombre}</p>
                          {p.variantes?.length > 0 && <p className="text-parchment-muted text-[11px]">{p.variantes.length} variantes</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs bg-espresso-600 text-parchment-dim border border-espresso-500 px-2.5 py-1 rounded-full">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {editId === p._id ? (
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
                          onClick={() => { setEditId(p._id); setEditVal(String(p.precio)) }}
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
                          onClick={() => setForm(formDeProducto(p))}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
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
        <ModalProducto
          form={form}
          set={set}
          categorias={nombresCat}
          guardando={guardando}
          onGuardar={guardar}
          onCerrar={cerrarForm}
        />
      )}
    </div>
  )
}