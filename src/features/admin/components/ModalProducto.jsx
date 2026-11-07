import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Upload, Link as LinkIcon, X, ImageOff } from 'lucide-react'
import { esUrlHttp } from '../../../utils/imagen'

const campo = 'w-full bg-espresso-600 border border-espresso-500 rounded-xl px-4 py-2.5 text-sm text-parchment placeholder:text-parchment-muted focus:outline-none focus:border-gold-500 transition-colors'

const claseModo = (activo) =>
  `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
    activo ? 'bg-espresso-700 text-gold-500 shadow-sm' : 'text-parchment-muted hover:text-parchment'
  }`

export default function ModalProducto({ form, set, categorias, guardando, onGuardar, onCerrar }) {
  // Determinamos si inicia en modo URL o archivo según si la imagen actual es un enlace http
  const [modoImg, setModoImg] = useState(() => (esUrlHttp(form.imagen) ? 'url' : 'archivo'))
  const inputArchivo = useRef(null)
  const editando = Boolean(form.id)

  const elegirArchivo = (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return

    // Guardamos el archivo físico real en el estado y creamos una URL temporal solo para la vista previa
    set('imagenFile', archivo)
    set('imagen', URL.createObjectURL(archivo))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onCerrar}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-espresso-500 bg-espresso-800 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <h3 className="font-display text-xl font-semibold text-parchment mb-5">{editando ? 'Editar producto' : 'Nuevo Producto'}</h3>
        <div className="space-y-4">
          <input placeholder="Nombre (ej. Mocha Blanco)" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} className={campo} />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Precio MXN (ej. 75)" value={form.precio} onChange={(e) => set('precio', e.target.value)} className={campo} />
            <input placeholder="Porción (ej. 12 oz)" value={form.porcion} onChange={(e) => set('porcion', e.target.value)} className={campo} />
          </div>
          <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)} className={`${campo} appearance-none`}>
            <option value="" disabled className="text-parchment-muted">Selecciona una categoría</option>
            {form.categoria && !categorias.includes(form.categoria) && <option>{form.categoria}</option>}
            {categorias.map((n) => <option key={n}>{n}</option>)}
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
                <button type="button" onClick={() => setModoImg('url')} className={claseModo(modoImg === 'url')}>
                  <LinkIcon className="h-3.5 w-3.5" /> Enlace
                </button>
                <button type="button" onClick={() => setModoImg('archivo')} className={claseModo(modoImg === 'archivo')}>
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
                      onClick={() => { set('imagen', ''); set('imagenFile', null); }}
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
                      value={esUrlHttp(form.imagen) ? form.imagen : ''}
                      onChange={(e) => { set('imagen', e.target.value); set('imagenFile', null); }}
                      className={campo}
                    />
                    <p className="mt-2 text-[11px] text-parchment-muted leading-relaxed">Pega el enlace directo a la imagen.</p>
                  </>
                ) : (
                  <>
                    <input key="imagen-archivo" ref={inputArchivo} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={elegirArchivo} className="hidden" />
                    <button
                      type="button"
                      onClick={() => inputArchivo.current?.click()}
                      className="h-11 w-full rounded-xl border border-dashed border-espresso-400 bg-espresso-700/30 text-sm font-medium text-parchment-dim hover:border-gold-500 hover:text-gold-500 transition-colors"
                    >
                      {form.imagenFile ? 'Cambiar archivo seleccionado' : 'Elegir archivo local'}
                    </button>
                    <p className="mt-2 text-[11px] text-parchment-muted leading-relaxed">
                      Se subirá y optimizará automáticamente en la nube.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onCerrar} className="flex-1 h-12 rounded-xl bg-espresso-700 border border-espresso-500 text-sm font-semibold text-parchment-muted hover:text-parchment hover:border-espresso-400 transition-colors">
            Cancelar
          </button>
          <button
            onClick={onGuardar}
            disabled={guardando}
            className="flex-1 h-12 rounded-xl bg-gold-500 text-espresso-950 font-bold text-sm hover:bg-gold-400 transition-colors disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Añadir producto'}
          </button>
        </div>
      </div>
    </div>
  )
}