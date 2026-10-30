import { Menu, Bell, BellOff, LogOut } from 'lucide-react'

export default function AdminHeader({ enLinea, sonido, onAbrirMenu, onAlternarSonido, onCerrarSesion }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 bg-espresso-800/95 backdrop-blur-xl border-b border-espresso-600">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onAbrirMenu}
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <span className={`w-2 h-2 rounded-full ${enLinea ? 'bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${enLinea ? 'text-success' : 'text-red-500'}`}>
              {enLinea ? 'En línea' : 'Desconectado'}
            </span>
          </div>

          <span className={`sm:hidden w-2.5 h-2.5 rounded-full ${enLinea ? 'bg-success animate-pulse' : 'bg-red-500'}`} />

          <button
            onClick={onAlternarSonido}
            aria-label={sonido ? 'Silenciar aviso de pedidos' : 'Activar aviso de pedidos'}
            title={sonido ? 'Sonido activado' : 'Sonido silenciado'}
            className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors ${
              sonido
                ? 'bg-espresso-700 border-espresso-500 text-gold-500'
                : 'bg-espresso-800 border-espresso-600 text-parchment-muted hover:text-parchment hover:bg-espresso-700'
            }`}
          >
            {sonido ? <Bell className="h-4.5 w-4.5" /> : <BellOff className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={onCerrarSesion}
            aria-label="Cerrar sesión"
            className="h-10 w-10 rounded-xl border border-espresso-500 bg-espresso-700 flex items-center justify-center text-parchment-muted transition-colors hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
