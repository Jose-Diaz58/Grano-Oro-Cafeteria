import { NavLink, Link } from 'react-router-dom'
import { ShoppingBag, Package, Menu, SlidersHorizontal, Settings, X, Store } from 'lucide-react'

const NAV = [
  { to: '/admin/pedidos', label: 'Pedidos en vivo', icon: ShoppingBag, seccion: 'Operación' },
  { to: '/admin/catalogo', label: 'Productos', icon: Package, seccion: 'Menú' },
  { to: '/admin/categorias', label: 'Categorías', icon: Menu },
  { to: '/admin/extras', label: 'Extras globales', icon: SlidersHorizontal },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings, seccion: 'Negocio' },
]

export default function AdminSidebar({ abierto, onCerrar, sinAtender, config }) {
  return (
    <>
      {abierto && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden" onClick={onCerrar} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-espresso-600 bg-espresso-800 transition-transform duration-300 ease-in-out md:z-30 md:top-16 md:w-60 md:translate-x-0 ${
          abierto ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-espresso-600 px-5 md:hidden">
          <span className="font-display text-lg font-semibold text-parchment">Menú</span>
          <button
            onClick={onCerrar}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-parchment-muted hover:bg-espresso-700 hover:text-parchment transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
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
                    isActive ? 'bg-gold-500 text-espresso-950 shadow-sm' : 'text-parchment-dim hover:bg-espresso-700 hover:text-parchment'
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

        <div className="shrink-0 border-t border-espresso-600 p-4 space-y-3">
          <Link
            to="/"
            onClick={onCerrar}
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
    </>
  )
}
