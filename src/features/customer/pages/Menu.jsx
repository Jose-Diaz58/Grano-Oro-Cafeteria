import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { useCartStore, selectTotalItems } from '../../../store/cartStore'
import { CATEGORIA_TODAS } from '../../../config/constants'
import { verificarDisponibilidad, infoDeConfig } from '../../../utils/tienda'
import { SkeletonProducto } from '../../../components/ui/Skeletons'
import ClosedNotice from '../../../components/ClosedNotice'
import Navbar from '../components/Navbar'
import CategoriasNav from '../components/CategoriasNav'
import ProductGrid from '../components/ProductGrid'
import SplashScreen from '../components/SplashScreen'
import CartModal from '../modals/CartModal'
import InfoModal from '../modals/InfoModal'
import ProductDetailModal from '../modals/ProductDetailModal'
import { useMenuData } from '../hooks/useMenuData'

const TRANSICION_CATEGORIA_MS = 400

export default function Menu() {
  const { config, productos, categorias, cargando } = useMenuData()

  const [categoriaActiva, setCategoriaActiva] = useState(CATEGORIA_TODAS)
  const [cambiandoCategoria, setCambiandoCategoria] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const [mostrarCarrito, setMostrarCarrito] = useState(false)
  const [mostrarInfo, setMostrarInfo] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const { token } = useAuth()
  const navigate = useNavigate()

  const agregarAlCarrito = useCartStore((s) => s.agregarAlCarrito)
  const totalItems = useCartStore(selectTotalItems)

  const estadoTienda = verificarDisponibilidad(config)
  const tiendaCerrada = !estadoTienda.abierto
  const info = { ...infoDeConfig(config), estadoTienda }
  const mostrarEsqueleto = cargando || cambiandoCategoria

  const seleccionarCategoria = (cat) => {
    if (cat === categoriaActiva) return
    setCambiandoCategoria(true)
    setCategoriaActiva(cat)
    setTimeout(() => setCambiandoCategoria(false), TRANSICION_CATEGORIA_MS)
  }

  const agregarSiAbierto = (producto, variante, extras) => {
    if (tiendaCerrada) {
      alert(`Lo sentimos. ${estadoTienda.motivo}`)
      return
    }
    agregarAlCarrito(producto, variante, extras)
  }

  const texto = busqueda.toLowerCase()
  const productosFiltrados = productos.filter(
    (prod) =>
      (categoriaActiva === CATEGORIA_TODAS || prod.categoria === categoriaActiva) &&
      (prod.nombre.toLowerCase().includes(texto) || prod.descripcion?.toLowerCase().includes(texto)),
  )

  if (!mostrarEsqueleto && tiendaCerrada) {
    return (
      <ClosedNotice
        config={config}
        nextOpening={estadoTienda.proximaApertura}
        onAdmin={token ? () => navigate('/admin/pedidos') : undefined}
        brandLogoUrl={info.logoUrl}
      />
    )
  }

  return (
    <div className="min-h-screen bg-espresso-900 font-body pb-24">
      <SplashScreen mostrar={cargando} />

      <Navbar
        cartCount={totalItems}
        onOpenCart={() => setMostrarCarrito(true)}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onOpenInfo={() => setMostrarInfo(true)}
        nombre={info.nombre}
      />
      <CategoriasNav categorias={categorias} categoriaActiva={categoriaActiva} onSelectCategoria={seleccionarCategoria} />

      <main className="mx-auto max-w-6xl px-4 pt-6">
        {busqueda && (
          <div className="mb-4 text-xs text-parchment-muted">
            Resultados para: <span className="font-bold text-parchment">"{busqueda}"</span> ({productosFiltrados.length})
          </div>
        )}

        {mostrarEsqueleto ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProducto key={i} />
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <Package className="mb-4 h-14 w-14 text-parchment-muted opacity-40" strokeWidth={1.3} />
            <h2 className="font-display text-xl font-semibold text-parchment">Nada por aquí todavía</h2>
            <p className="mt-2 max-w-xs text-sm text-parchment-muted">No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <ProductGrid productos={productosFiltrados} onAgregar={agregarSiAbierto} onVerDetalle={setProductoSeleccionado} />
        )}
      </main>

      <CartModal mostrar={mostrarCarrito} onCerrar={() => setMostrarCarrito(false)} info={info} />
      <InfoModal mostrar={mostrarInfo} onCerrar={() => setMostrarInfo(false)} info={info} />
      <ProductDetailModal producto={productoSeleccionado} onCerrar={() => setProductoSeleccionado(null)} onAgregar={agregarSiAbierto} />
    </div>
  )
}
