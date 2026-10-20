import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Package, Menu, SlidersHorizontal, Settings, LogOut, Bell, BellOff, X, Store } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { usePedidosEnVivo } from '../../hooks/usePedidosEnVivo.js'
import { sonarAlerta } from '../../utils/alerta.js'
import { avisarNuevosPedidos } from '../../utils/avisoPedidos.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { CONFIG_INICIAL } from '../../data/mockData.js'
import { pedir } from '../../api.js'

const NAV = [
  { to: '/admin/pedidos', label: 'Pedidos en vivo', icon: ShoppingBag, seccion: 'Operación' },
  { to: '/admin/catalogo', label: 'Productos', icon: Package, seccion: 'Menú' },
  { to: '/admin/categorias', label: 'Categorías', icon: Menu },
  { to: '/admin/extras', label: 'Extras globales', icon: SlidersHorizontal },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings, seccion: 'Negocio' },
]

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [config, setConfig] = useState(CONFIG_INICIAL)

  // Estado para el menú hamburguesa en móvil
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const [sonido, setSonido] = useState(() => {
    try { return localStorage.getItem('sonidoPedidos') !== 'off' } catch { return true }
  })

  const alternarSonido = () => {
    const nuevo = !sonido
    setSonido(nuevo)
    try { localStorage.setItem('sonidoPedidos', nuevo ? 'on' : 'off') } catch { }
    if (nuevo) sonarAlerta()
  }

  const avisarNuevos = useCallback((nuevos) => {
    if (sonido) sonarAlerta()
    avisarNuevosPedidos(nuevos, { onVer: () => navigate('/admin/pedidos') })
  }, [sonido, navigate])

  const pedidosVivo = usePedidosEnVivo({ onNuevo: avisarNuevos })
  const sinAtender = pedidosVivo.pedidos.filter((p) => p.estado === 'Nuevo').length

  useEffect(() => {
    document.title = sinAtender > 0 ? `(${sinAtender}) Nuevos pedidos • Grano de Oro` : 'Grano de Oro'
    return () => { document.title = 'Grano de Oro' }
  }, [sinAtender])

  useEffect(() => {
    let activo = true
    pedir('/configuracion/buscar')
      .then((datos) => activo && setConfig((prev) => ({ ...prev, ...datos })))
      .catch(() => {})
    return () => { activo = false }
  }, [])

  const actualizarConfig = (nueva) => setConfig((prev) => ({ ...prev, ...nueva }))

  // Cierra el menú móvil automáticamente al cambiar de ruta
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileOpen])

  return (
    <div className="min-h-screen bg-espresso-900">
      
      {/* HEADER SUPERIOR */}
      <header className="fixed top-0 inset-x-0 z-40 h-16 bg-espresso-800/95 backdrop-blur-xl border-b border-espresso-600">
        <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Botón Hamburguesa (Solo Móvil) */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-espresso-500 bg-espresso-700 text-parchment transition-colors hover:border-gold-500 hover:text-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div>
              <span className="font-display font-semibold text-[15px] text-parchment">Grano de Oro</span>
              <span className="text-parchment-muted text-xs ml-2 hidden sm:inline">| Panel de Administración</span>
            </div>
          </div>

          {/* Controles de la Derecha */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className={`w-2 h-2 rounded-full ${pedidosVivo.enLinea ? 'bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${pedidosVivo.enLinea ? 'text-success' : 'text-red-500'}`}>
                {pedidosVivo.enLinea ? 'En línea' : 'Desconectado'}
              </span>
            </div>
            
            {/* Punto indicador simplificado para móvil */}
            <span className={`sm:hidden w-2.5 h-2.5 rounded-full ${pedidosVivo.enLinea ? 'bg-success animate-pulse' : 'bg-red-500'}`} />

            <button
              onClick={alternarSonido}
              aria-label={sonido ? 'Silenciar aviso de pedidos' : 'Activar aviso de pedidos'}
              title={sonido ? 'Sonido activado' : 'Sonido silenciado'}
              className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors ${
                sonido ? 'bg-espresso-700 border-espresso-500 text-gold-500' : 'bg-espresso-800 border-espresso-600 text-parchment-muted hover:text-parchment hover:bg-espresso-700'
              }`}
            >
              {sonido ? <Bell className="h-4.5 w-4.5" /> : <BellOff className="h-4.5 w-4.5" />}
            </button>
            
            <button
              onClick={() => { logout(); navigate('/admin/login') }}
              aria-label="Cerrar sesión"
              className="h-10 w-10 rounded-xl border border-espresso-500 bg-espresso-700 flex items-center justify-center text-parchment-muted transition-colors hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY OSCURO (Solo Móvil) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* MENÚ LATERAL (Sidebar) */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-espresso-600 bg-espresso-800 transition-transform duration-300 ease-in-out md:z-30 md:top-16 md:w-60 md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Cabecera del sidebar solo visible en móvil */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-espresso-600 px-5 md:hidden">
          <span className="font-display text-lg font-semibold text-parchment">Menú</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-muted hover:bg-espresso-700 hover:text-parchment transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 styled-scroll">
          {NAV.map(({ to, label, icon: Icon, seccion }, i) => (
            <div key={to}>
              {seccion && (
                <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-parchment-muted ${i > 0 ? 'mt-6' : ''}`}>
                  {seccion}
                </p>
              )}
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `mb-1 flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-500 text-espresso-950 shadow-sm'
                      : 'text-parchment-dim hover:bg-espresso-700 hover:text-parchment'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-espresso-950' : 'text-parchment-muted'}`} strokeWidth={isActive ? 2.5 : 2} />
                    {label}
                    {to === '/admin/pedidos' && sinAtender > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
                        {sinAtender}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </div>
          ))}
        </nav>
        
        {/* PARTE INFERIOR DEL SIDEBAR CON BOTÓN A VISTA PÚBLICA */}
        <div className="shrink-0 border-t border-espresso-600 p-4 space-y-3">
          
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gold-500 transition-colors hover:bg-gold-500/10"
          >
            <Store className="h-4.5 w-4.5" />
            Ver menú público
          </Link>

          <div className="rounded-xl border border-espresso-500/50 bg-espresso-700/50 p-4">
            <p className="text-sm font-semibold text-parchment">{config.sucursal}</p>
            <p className="mt-1 text-[11px] font-medium text-parchment-muted">Hoy • {config.apertura} – {config.cierre}</p>
          </div>
          
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="pt-16 md:ml-60">
        <Outlet context={{ config, actualizarConfig, pedidosVivo }} />
      </main>
      
    </div>
  )
}